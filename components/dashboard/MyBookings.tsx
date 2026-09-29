"use client";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type Booking = {
  id: string;
  reference: string;
  date: string;
  timeSlot: string;
  venue: string;
  status: string;
  packageName: string | null;
  guests: number | null;
  paymentMethod: string | null;
};

const STATUS_STYLE: Record<string, string> = {
  PENDING: "border-yellow-500/40 text-yellow-600 dark:text-yellow-500",
  CONFIRMED: "border-green-500/40 text-green-600 dark:text-green-500",
  COMPLETED: "border-blue-500/40 text-blue-600 dark:text-blue-500",
  CANCELLED: "border-red-500/40 text-red-600 dark:text-red-500",
};

export function MyBookings({ bookings }: { bookings: Booking[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {bookings.map((b) => (
        <div
          key={b.id}
          className="rounded-3xl border border-ink-200 p-6 dark:border-ink-700"
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow mb-1">{b.reference}</p>
              <p className="font-display text-2xl tracking-tightest">
                {format(new Date(b.date), "EEE, d MMM yyyy")}
              </p>
              <p className="text-sm text-ink-400">{b.timeSlot}</p>
            </div>
            <span
              className={cn(
                "rounded-full border px-3 py-1 text-[10px] uppercase tracking-luxe",
                STATUS_STYLE[b.status] ?? ""
              )}
            >
              {b.status}
            </span>
          </div>

          <ul className="space-y-2 text-sm text-ink-500 dark:text-ink-300">
            <li>📍 {b.venue}</li>
            {b.packageName && <li>📦 {b.packageName}</li>}
            {b.guests && <li>👥 {b.guests} guests</li>}
            {b.paymentMethod && <li>💳 {b.paymentMethod}</li>}
          </ul>
        </div>
      ))}
    </div>
  );
}