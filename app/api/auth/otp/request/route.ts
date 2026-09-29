import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { generateOtp, hashCode, sendWhatsAppOtp } from "@/lib/whatsapp";
import { PHONE_REGEX } from "@/lib/schemas/booking";

const schema = z.object({ phone: z.string().regex(PHONE_REGEX) });

export async function POST(req: Request) {
  const { phone } = schema.parse(await req.json());
  // نظّف الرقم + حوّله للصيغة الدولية (20xxxxxxxxxx)
let clean = phone.replace(/[^\d]/g, ""); // شيل كل حاجة مش رقم
if (clean.startsWith("0")) {
  clean = "20" + clean.slice(1); // 0105544 → 20105544
} else if (!clean.startsWith("20")) {
  clean = "20" + clean; // لو مش بيبدأ بـ 20
}

  const recent = await prisma.otpCode.findFirst({
    where: { phone: clean, consumed: false, createdAt: { gt: new Date(Date.now() - 45_000) } },
  });
  if (recent) return NextResponse.json({ message: "Please wait before requesting a new code." }, { status: 429 });

  const code = generateOtp();
  await prisma.otpCode.create({ data: { phone: clean, codeHash: hashCode(clean, code), expiresAt: new Date(Date.now() + 5 * 60_000) } });

  try { await sendWhatsAppOtp(clean, code); }
  catch (e) { console.error("WhatsApp send failed", e); return NextResponse.json({ message: "Could not send code." }, { status: 502 }); }
  return NextResponse.json({ ok: true });
}
