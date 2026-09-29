import crypto from "crypto";

const ADMIN = process.env.WHATSAPP_ADMIN_NUMBER || "201001234567";
const SECRET = process.env.OTP_SECRET || "fallback-secret";
const WA_SERVICE_URL = process.env.WA_SERVICE_URL || "http://localhost:3010";
const WA_SECRET = process.env.BAILEYS_SECRET || "beso-wa-secret";

/* ── إرسال عبر Baileys Service ── */
async function send(to: string, body: string) {
  const res = await fetch(`${WA_SERVICE_URL}/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Secret": WA_SECRET,
    },
    body: JSON.stringify({ to, message: body }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Send failed: ${err.error || res.statusText}`);
  }
}

/* ── OTP helpers ── */
export const generateOtp = () => String(crypto.randomInt(100000, 999999));

export const hashCode = (phone: string, code: string) =>
  crypto.createHmac("sha256", SECRET).update(`${phone}:${code}`).digest("hex");

export async function sendWhatsAppOtp(phone: string, code: string) {
  console.log("\n");
  console.log("╔══════════════════════════════════╗");
  console.log("║  🔐 OTP CODE:", code);
  console.log("╚══════════════════════════════════╝");
  console.log("\n");

  try {
    await send(
      phone,
      `*Weddings by Beso*\n\nYour verification code is *${code}*.\nExpires in 5 minutes.`
    );
    console.log("✅ OTP اتبعت على WhatsApp");
  } catch (e: any) {
    console.warn("⚠️ فشل الإرسال:", e.message);
    console.warn("⚠️ الكود مطبوع في Terminal — استخدمه للتسجيل");
  }
}

/* ── Contact → WhatsApp link ── */
export function buildAdminWhatsAppLink(p: {
  name: string;
  phone: string;
  message: string;
  preferredDate?: string | null;
}) {
  const lines = [
    `*New inquiry — Weddings by Beso*`,
    ``,
    `*Name:* ${p.name}`,
    `*Phone:* ${p.phone}`,
    p.preferredDate ? `*Preferred:* ${p.preferredDate}` : null,
    ``,
    `*Message:*`,
    p.message,
  ].filter(Boolean);

  return `https://wa.me/${ADMIN}?text=${encodeURIComponent(lines.join("\n"))}`;
}

/* ═══════════════════════════════════════════════════════════════
   إشعار الأدمن بحجز جديد
   ═══════════════════════════════════════════════════════════════ */

export type BookingNotification = {
  reference: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string | null;
  date: string;         // "2026-10-15"
  timeSlot: string;     // "14:00"
  venue: string;
  packageName?: string | null;
  guests?: number | null;
  notes?: string | null;
  paymentMethod?: string | null;
};

export async function sendBookingNotificationToAdmin(
  booking: BookingNotification
) {
  if (!ADMIN) {
    console.warn("⚠️ WHATSAPP_ADMIN_NUMBER not configured");
    return;
  }

  const lines = [
    `🔔 *حجز جديد — Weddings by Beso*`,
    ``,
    `📋 *المرجع:* ${booking.reference}`,
    ``,
    `👤 *العميل:* ${booking.clientName}`,
    `📱 *الموبايل:* ${booking.clientPhone}`,
    booking.clientEmail ? `📧 *الإيميل:* ${booking.clientEmail}` : null,
    ``,
    `📅 *التاريخ:* ${booking.date}`,
    `🕐 *الوقت:* ${booking.timeSlot}`,
    `📍 *المكان:* ${booking.venue}`,
    booking.packageName ? `📦 *الباقة:* ${booking.packageName}` : null,
    booking.paymentMethod ? `💳 *الدفع:* ${booking.paymentMethod}` : null,
    booking.notes ? `\n📝 *ملاحظات:*\n${booking.notes}` : null,
    ``,
    `━━━━━━━━━━━━━━━━━━━━`,
    `📞 للتواصل: https://wa.me/${booking.clientPhone.replace(/[^\d]/g, "")}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await send(ADMIN, lines);
    console.log("✅ تم إرسال إشعار الحجز للأدمن");
  } catch (e: any) {
    console.error("❌ فشل إرسال إشعار الحجز:", e.message);
  }
}
/* ═══════════════════════════════════════════════════════════════
   إرسال رسالة للأدمن عبر الخدمة
   ═══════════════════════════════════════════════════════════════ */

export type ContactMessage = {
  name: string;
  phone: string;
  message: string;
  preferredDate?: string | null;
};

export async function sendContactMessageToAdmin(payload: ContactMessage) {
  if (!ADMIN) {
    console.warn("⚠️ WHATSAPP_ADMIN_NUMBER not configured");
    return;
  }

  const lines = [
    `*استفسار جديد — Weddings by Beso*`,
    ``,
    `*الاسم:* ${payload.name}`,
    `*الموبايل:* ${payload.phone}`,
    payload.preferredDate ? `*التاريخ المفضل:* ${payload.preferredDate}` : null,
    ``,
    `*الرسالة:*`,
    payload.message,
    ``,
    `━━━━━━━━━━━━━━━━━━━━`,
    `📞 للرد: https://wa.me/${payload.phone.replace(/[^\d]/g, "")}`,
  ]
    .filter(Boolean)
    .join("\n");

  await send(ADMIN, lines);
  console.log("✅ تم إرسال استفسار للأدمن");
}