import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashCode } from "@/lib/whatsapp";
import { createSession } from "@/lib/session";
import { PHONE_REGEX } from "@/lib/schemas/booking";

const schema = z.object({ phone: z.string().regex(PHONE_REGEX), code: z.string().length(6) });

export async function POST(req: Request) {
  const { phone, code } = schema.parse(await req.json());
  // نظّف الرقم + حوّله للصيغة الدولية (20xxxxxxxxxx)
let clean = phone.replace(/[^\d]/g, ""); // شيل كل حاجة مش رقم
if (clean.startsWith("0")) {
  clean = "20" + clean.slice(1); // 0105544 → 20105544
} else if (!clean.startsWith("20")) {
  clean = "20" + clean; // لو مش بيبدأ بـ 20
}

  const otp = await prisma.otpCode.findFirst({ where: { phone: clean, consumed: false }, orderBy: { createdAt: "desc" } });
  if (!otp) return NextResponse.json({ message: "No active code" }, { status: 400 });
  if (otp.expiresAt < new Date()) return NextResponse.json({ message: "Code expired" }, { status: 400 });
  if (otp.attempts >= 5) return NextResponse.json({ message: "Too many attempts" }, { status: 429 });

  const ok = otp.codeHash === hashCode(clean, code);
  if (!ok) {
    await prisma.otpCode.update({ where: { id: otp.id }, data: { attempts: { increment: 1 } } });
    return NextResponse.json({ message: "Incorrect code" }, { status: 400 });
  }

  await prisma.otpCode.update({ where: { id: otp.id }, data: { consumed: true } });
  const user = await prisma.user.upsert({ where: { phone: clean }, update: {}, create: { phone: clean } });
  await createSession({ sub: user.id, phone: user.phone, role: user.role });
  return NextResponse.json({ ok: true, role: user.role });
}
