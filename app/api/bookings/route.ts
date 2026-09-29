import { NextResponse } from "next/server";
import { format } from "date-fns";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/lib/schemas/booking";
import { getSession } from "@/lib/session";
import { hashCode, sendBookingNotificationToAdmin } from "@/lib/whatsapp";

const makeReference = () =>
  `BESO-${format(new Date(), "yyMMdd")}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;

const bodySchema = bookingSchema.extend({
  otpCode: z.string().length(6, "OTP required"),
});

export async function POST(req: Request) {
  const parsed = bodySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid input", issues: parsed.error.issues },
      { status: 422 }
    );
  }

  const { otpCode, ...data } = parsed.data;
  const session = await getSession();

  // نظّف رقم الموبايل
  let cleanPhone = data.clientPhone.replace(/[^\d]/g, "");
  if (cleanPhone.startsWith("0")) cleanPhone = "20" + cleanPhone.slice(1);
  else if (!cleanPhone.startsWith("20")) cleanPhone = "20" + cleanPhone;

  // 🔒 تحقق من OTP
  const otp = await prisma.otpCode.findFirst({
    where: { phone: cleanPhone, consumed: false },
    orderBy: { createdAt: "desc" },
  });

  if (!otp) {
    return NextResponse.json(
      { message: "No active code. Please request OTP first." },
      { status: 400 }
    );
  }
  if (otp.expiresAt < new Date()) {
    return NextResponse.json({ message: "Code expired" }, { status: 400 });
  }
  if (otp.attempts >= 5) {
    return NextResponse.json(
      { message: "Too many attempts" },
      { status: 429 }
    );
  }

  const otpOk = otp.codeHash === hashCode(cleanPhone, otpCode);
  if (!otpOk) {
    await prisma.otpCode.update({
      where: { id: otp.id },
      data: { attempts: { increment: 1 } },
    });
    return NextResponse.json(
      { message: "Incorrect OTP code" },
      { status: 400 }
    );
  }

  // ✅ الـ OTP صح — نكمل الحجز
  try {
    let pkgName: string | null = null;

    const booking = await prisma.$transaction(async (tx) => {
      const dateObj = new Date(`${data.date}T00:00:00.000Z`);

      const av = await tx.availability.findUnique({
        where: { date_timeSlot: { date: dateObj, timeSlot: data.timeSlot } },
      });
      if (av?.status === "BLOCKED") throw new Error("SLOT_BLOCKED");

      if (data.packageId) {
        const pkg = await tx.package.findUnique({
          where: { id: data.packageId },
          select: { name: true },
        });
        pkgName = pkg?.name ?? null;
      }

      // ✅ استخدم الأوتانتيكيتد user أو اربطه بالموبايل
      let userId = session?.sub ?? null;
      if (!userId) {
        // لو العميل مش مسجّل، نعمل له حساب CLIENT بالرقم
        const user = await tx.user.upsert({
          where: { phone: cleanPhone },
          update: {},
          create: { phone: cleanPhone, role: "CLIENT" },
        });
        userId = user.id;
      }

      // علّم الـ OTP كمستهلك
      await tx.otpCode.update({
        where: { id: otp.id },
        data: { consumed: true },
      });

      return tx.booking.create({
        data: {
          reference: makeReference(),
          userId,
          packageId: data.packageId || null,
          clientName: data.clientName,
          clientPhone: cleanPhone,
          clientEmail: data.clientEmail || null,
          date: dateObj,
          timeSlot: data.timeSlot,
          venue: data.venue,
          notes: data.notes ?? null,
          paymentMethod: data.paymentMethod ?? null,
          status: "PENDING",
        },
        select: { id: true, reference: true },
      });
    });

    // 🔔 إشعار الأدمن
    sendBookingNotificationToAdmin({
      reference: booking.reference,
      clientName: data.clientName,
      clientPhone: cleanPhone,
      clientEmail: data.clientEmail || null,
      date: data.date,
      timeSlot: data.timeSlot,
      venue: data.venue,
      packageName: pkgName,
      notes: data.notes || null,
      paymentMethod: data.paymentMethod || null,
    }).catch((err) => {
      console.error("Failed to send admin notification:", err);
    });

    return NextResponse.json({ reference: booking.reference }, { status: 201 });
  } catch (e: any) {
    if (e?.code === "P2002" || e?.message === "SLOT_BLOCKED") {
      return NextResponse.json(
        { message: "That slot was just taken. Please pick another." },
        { status: 409 }
      );
    }
    console.error(e);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}