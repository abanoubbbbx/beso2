"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { contactSchema } from "@/lib/schemas/booking";

type ContactValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactValues>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (values: ContactValues) => {
    if (values.company) return; // honeypot
    setError(null);

    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.message ?? "Could not send your message");
      return;
    }

    reset();
    setSent(true);
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-3xl border border-ink-200 p-10 text-center dark:border-ink-700"
      >
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-green-600 dark:text-green-500" />
        <h3 className="font-display text-3xl tracking-tightest">Message sent</h3>
        <p className="mt-3 text-sm text-ink-400">
          Thank you! Your message has been delivered to our team on WhatsApp.
          We'll get back to you shortly.
        </p>
        <button
          onClick={() => setSent(false)}
          className="btn-ghost mt-8"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="mb-2 block eyebrow">Name</label>
        <input {...register("name")} className="field" placeholder="Your name" />
        {errors.name && (
          <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block eyebrow">Phone</label>
          <input
            type="tel"
            inputMode="numeric"
            {...register("phone")}
            className="field"
            placeholder="01XXXXXXXXX"
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
          )}
        </div>
        <div>
          <label className="mb-2 block eyebrow">Preferred date</label>
          <input
            type="date"
            {...register("preferredDate")}
            className="field"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block eyebrow">Message</label>
        <textarea
          {...register("message")}
          rows={4}
          className="field resize-none"
          placeholder="Tell us about your event…"
        />
        {errors.message && (
          <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>
        )}
      </div>

      {/* Honeypot */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        {...register("company")}
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        aria-hidden
      />

      {error && <p className="text-xs text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full"
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send message
          </>
        )}
      </button>

      <p className="text-center text-xs text-ink-400">
        Your message goes straight to our team on WhatsApp.
      </p>
    </form>
  );
}