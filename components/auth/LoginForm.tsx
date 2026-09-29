"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PHONE_REGEX } from "@/lib/schemas/booking";

const phoneSchema = z.object({
  phone: z.string().regex(PHONE_REGEX, "Enter a valid Egyptian phone (01XXXXXXXXX)"),
});
const otpSchema = z.object({ code: z.string().length(6, "6-digit code") });

export function LoginForm() {
  const [stage, setStage] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const router = useRouter();

  const phoneForm = useForm<{ phone: string }>({ resolver: zodResolver(phoneSchema) });
  const otpForm = useForm<{ code: string }>({ resolver: zodResolver(otpSchema) });

  const requestOtp = async ({ phone }: { phone: string }) => {
    setSending(true); setError(null);
    const res = await fetch("/api/auth/otp/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    setSending(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.message ?? "Failed to send code");
      return;
    }
    setPhone(phone);
    setStage("otp");
  };

  const verifyOtp = async ({ code }: { code: string }) => {
    setSending(true); setError(null);
    const res = await fetch("/api/auth/otp/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, code }),
    });
    setSending(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.message ?? "Invalid code");
      return;
    }
    const { role } = await res.json();
    router.push(role === "ADMIN" ? "/admin" : "/dashboard");
    router.refresh();
  };

  return (
    <div className="w-full max-w-md">
      <AnimatePresence mode="wait">
        {stage === "phone" ? (
          <motion.form
            key="phone"
            onSubmit={phoneForm.handleSubmit(requestOtp)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <div>
              <label className="mb-2 block eyebrow">Phone (WhatsApp)</label>
              <input
                autoFocus
                type="tel"
                inputMode="numeric"
                {...phoneForm.register("phone")}
                className="field"
                placeholder="01XXXXXXXXX"
              />
              {phoneForm.formState.errors.phone && (
                <p className="mt-1 text-xs text-red-500">
                  {phoneForm.formState.errors.phone.message}
                </p>
              )}
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button type="submit" disabled={sending} className="btn-primary w-full">
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send code"}
            </button>
          </motion.form>
        ) : (
          <motion.form
            key="otp"
            onSubmit={otpForm.handleSubmit(verifyOtp)}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <div>
              <label className="mb-2 block eyebrow">
                6-digit code sent to WhatsApp
              </label>
              <input
                autoFocus
                inputMode="numeric"
                maxLength={6}
                {...otpForm.register("code")}
                className="field text-center text-2xl tracking-[0.6em]"
                placeholder="••••••"
              />
              {otpForm.formState.errors.code && (
                <p className="mt-1 text-xs text-red-500">
                  {otpForm.formState.errors.code.message}
                </p>
              )}
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            <button type="submit" disabled={sending} className="btn-primary w-full">
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
            </button>
            <button
              type="button"
              onClick={() => setStage("phone")}
              className="text-xs uppercase tracking-luxe text-ink-400 hover:underline"
            >
              Change number
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}