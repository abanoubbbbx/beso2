import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/schemas/booking";
import { sendContactMessageToAdmin } from "@/lib/whatsapp";

export async function POST(req: Request) {
  const parsed = contactSchema.safeParse(await req.json());
  if (!parsed.success || parsed.data.company) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { company, ...data } = parsed.data;

  // 1. حفظ في الداتابيز
  await prisma.inquiry.create({
    data: {
      name: data.name,
      phone: data.phone,
      message: data.message,
      preferredDate: data.preferredDate
        ? new Date(data.preferredDate)
        : null,
    },
  });

  // 2. إرسال للأدمن على واتساب (fire-and-forget)
  sendContactMessageToAdmin({
    name: data.name,
    phone: data.phone,
    message: data.message,
    preferredDate: data.preferredDate || null,
  }).catch((err) => {
    console.error("Failed to send admin contact message:", err);
  });

  return NextResponse.json({ ok: true });
}