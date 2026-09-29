import { prisma } from "@/lib/prisma";
import { startOfMonth } from "date-fns";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const now = new Date();
  const [upcoming, monthBookings, inquiries, confirmed, completed] = await Promise.all([
    prisma.booking.count({ where: { date: { gte: now }, status: { in: ["PENDING", "CONFIRMED"] } } }),
    prisma.booking.count({ where: { createdAt: { gte: startOfMonth(now) } } }),
    prisma.inquiry.count({ where: { handled: false } }),
    prisma.booking.count({ where: { status: "CONFIRMED" } }),
    prisma.booking.count({ where: { status: "COMPLETED" } }),
  ]);
  const stats = [
    { label: "Upcoming bookings", value: upcoming },
    { label: "New this month", value: monthBookings },
    { label: "Unhandled inquiries", value: inquiries },
    { label: "Confirmed", value: confirmed },
    { label: "Completed", value: completed },
  ];
  return (
    <div>
      <h1 className="mb-10 font-display text-5xl tracking-tightest">Overview</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-3xl border border-ink-200 p-8 dark:border-ink-700">
            <p className="eyebrow">{s.label}</p>
            <p className="mt-4 font-display text-6xl tracking-tightest">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
