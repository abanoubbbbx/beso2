"use client";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, ShieldCheck, MessageCircle } from "lucide-react";
import { bookingSchema, type BookingInput } from "@/lib/schemas/booking";
import { BookingCalendar, type DayAvailability } from "./BookingCalendar";
import { cn } from "@/lib/utils";

type PackageLite = { id: string; name: string; price: number; currency: string };

export function BookingForm({
  packages,
  preselectedSlug,
}: {
  packages: PackageLite[];
  preselectedSlug?: string;
}) {
  const [monthData, setMonthData] = useState<DayAvailability[]>([]);
  const [loadingMonth, setLoadingMonth] = useState(false);
  const [date, setDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [done, setDone] = useState<{ reference: string } | null>(null);

  // OTP stages
  const [stage, setStage] = useState<"form" | "otp">("form");
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSending, setOtpSending] = useState(false);
  const [pendingValues, setPendingValues] = useState<BookingInput | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      packageId:
        packages.find((p) =>
          p.name.toLowerCase().includes(preselectedSlug ?? "")
        )?.id ?? "",
    },
  });

  useEffect(() => {
    if (date)
      setValue("date", format(date, "yyyy-MM-dd"), { shouldValidate: true });
  }, [date, setValue]);
  useEffect(() => {
    if (slot) setValue("timeSlot", slot, { shouldValidate: true });
  }, [slot, setValue]);

  const fetchMonth = useCallback(async (from: string, to: string) => {
    setLoadingMonth(true);
    try {
      const res = await fetch(`/api/availability?from=${from}&to=${to}`, {
        cache: "no-store",
      });
      const json = await res.json();
      setMonthData(json.days ?? []);
    } finally {
      setLoadingMonth(false);
    }
  }, []);

  useEffect(() => {
    const now = new Date();
    fetchMonth(
      format(new Date(now.getFullYear(), now.getMonth(), 1), "yyyy-MM-dd"),
      format(new Date(now.getFullYear(), now.getMonth() + 1, 0), "yyyy-MM-dd")
    );
  }, [fetchMonth]);

  const onRequestOtp = async (values: BookingInput) => {
    const res = await fetch("/api/bookings/request-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: values.clientPhone }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err.message ?? "Could not send OTP");
      return;
    }
    setPendingValues(values);
    setStage("otp");
  };

  const onVerifyAndBook = async () => {
    if (!pendingValues) return;
    setOtpSending(true);
    setOtpError(null);

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...pendingValues, otpCode }),
    });

    setOtpSending(false);

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setOtpError(err.message ?? "Could not submit booking");
      return;
    }

    const { reference } = await res.json();
    setDone({ reference });
  };

  // ✨ شاشة النجاح
  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-2xl text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10"
        >
          <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-500" />
        </motion.div>

        <p className="eyebrow mb-4">Booking received</p>
        <h2 className="font-display text-5xl tracking-tightest md:text-6xl">
          Thank you!
        </h2>
        <p className="mt-6 max-w-lg mx-auto text-ink-500 dark:text-ink-300">
          Your reservation has been successfully submitted. We'll review the
          details and get back to you on WhatsApp very soon.
        </p>

        <div className="mt-10 rounded-3xl border border-ink-200 p-8 text-left dark:border-ink-700">
          <p className="eyebrow mb-3">Your reference</p>
          <p className="font-mono text-2xl tracking-tightest">
            {done.reference}
          </p>
          <p className="mt-4 text-xs text-ink-400">
            Save this reference — you can use it to track your booking.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="/dashboard"
            className="btn-primary"
          >
            View my bookings
          </a>
          <a
            href="https://wa.me/201017302646"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            <MessageCircle className="h-4 w-4" />
            Chat on WhatsApp
          </a>
        </div>

        <p className="mt-12 text-xs text-ink-400">
          A confirmation message has been sent to your WhatsApp.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-16 lg:grid-cols-2">
      <BookingCalendar
        monthData={monthData}
        selectedDate={date}
        selectedSlot={slot}
        onSelectDate={setDate}
        onSelectSlot={setSlot}
        onMonthChange={fetchMonth}
        loading={loadingMonth}
      />

      <AnimatePresence mode="wait">
        {stage === "form" ? (
          <motion.form
            key="form"
            onSubmit={handleSubmit(onRequestOtp)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <div>
              <label className="mb-2 block eyebrow">Name</label>
              <input
                {...register("clientName")}
                className="field"
                placeholder="Your full name"
              />
              {errors.clientName && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.clientName.message}
                </p>
              )}
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block eyebrow">Phone (WhatsApp)</label>
                <input
                  type="tel"
                  inputMode="numeric"
                  {...register("clientPhone")}
                  className="field"
                  placeholder="01XXXXXXXXX"
                />
                {errors.clientPhone && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.clientPhone.message}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-2 block eyebrow">Email (optional)</label>
                <input
                  {...register("clientEmail")}
                  className="field"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block eyebrow">Package</label>
              <select {...register("packageId")} className="field">
                <option value="">Select a package…</option>
                {packages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.price.toLocaleString()} {p.currency}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block eyebrow">Date</label>
                <input
                  readOnly
                  value={date ? format(date, "EEE, d MMM yyyy") : ""}
                  className="field cursor-default"
                  placeholder="Pick from calendar"
                />
                <input type="hidden" {...register("date")} />
              </div>
              <div>
                <label className="mb-2 block eyebrow">Time</label>
                <input
                  readOnly
                  value={slot ?? ""}
                  className="field cursor-default"
                  placeholder="Pick a time slot"
                />
                <input type="hidden" {...register("timeSlot")} />
              </div>
            </div>

            <div>
              <label className="mb-2 block eyebrow">Venue / Location</label>
              <input
                {...register("venue")}
                className="field"
                placeholder="Venue name or address"
              />
              {errors.venue && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.venue.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block eyebrow">Notes</label>
              <textarea
                {...register("notes")}
                rows={3}
                className="field resize-none"
                placeholder="Anything we should know?"
              />
            </div>

            <fieldset className="pt-2">
              <legend className="mb-3 eyebrow">Preferred payment</legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {[
                  ["INSTAPAY", "InstaPay"],
                  ["FAWRY", "Fawry"],
                  ["VODAFONE_CASH", "Vodafone Cash"],
                  ["ORANGE_CASH", "Orange Cash"],
                  ["BANK_TRANSFER", "Bank Transfer"],
                  ["CASH", "Cash"],
                ].map(([v, label]) => {
                  const active = watch("paymentMethod") === v;
                  return (
                    <label
                      key={v}
                      className={cn(
                        "cursor-pointer rounded-full border px-4 py-2 text-center text-xs uppercase tracking-luxe transition",
                        active
                          ? "border-ink-900 bg-ink-900 text-ink-0 dark:border-ink-50 dark:bg-ink-50 dark:text-ink-900"
                          : "border-ink-300/70 hover:border-ink-900 dark:border-ink-600 dark:hover:border-ink-50"
                      )}
                    >
                      <input
                        type="radio"
                        value={v}
                        {...register("paymentMethod")}
                        className="sr-only"
                      />
                      {label}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <button
              type="submit"
              disabled={isSubmitting || !date || !slot}
              className="btn-primary w-full"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Continue to verify phone"
              )}
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <div className="rounded-3xl border border-ink-200 p-6 dark:border-ink-700">
              <ShieldCheck className="mb-4 h-6 w-6 text-accent" />
              <h3 className="font-display text-2xl tracking-tightest">
                Verify your phone
              </h3>
              <p className="mt-2 text-sm text-ink-400">
                We sent a 6-digit code to your WhatsApp. Enter it to complete
                your booking.
              </p>
            </div>

            <div>
              <label className="mb-2 block eyebrow">OTP Code</label>
              <input
                autoFocus
                inputMode="numeric"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                className="field text-center text-2xl tracking-[0.6em]"
                placeholder="••••••"
              />
            </div>

            {otpError && <p className="text-xs text-red-500">{otpError}</p>}

            <button
              type="button"
              onClick={onVerifyAndBook}
              disabled={otpCode.length !== 6 || otpSending}
              className="btn-primary w-full"
            >
              {otpSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Confirm & book"
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setStage("form");
                setOtpCode("");
                setOtpError(null);
              }}
              className="text-xs uppercase tracking-luxe text-ink-400 hover:underline"
            >
              ← Back to form
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}