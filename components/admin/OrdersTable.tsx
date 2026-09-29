"use client";
import { useState, useTransition } from "react";
import { format } from "date-fns";
import { updateBookingStatus } from "@/app/admin/orders/actions";
import { cn } from "@/lib/utils";

const STATUSES = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"] as const;
type Row = { id: string; reference: string; clientName: string; clientPhone: string; date: Date; timeSlot: string; venue: string; status: string; paymentMethod: string | null; packageName: string | null };

export function OrdersTable({ rows }: { rows: Row[] }) {
  const [filter, setFilter] = useState<"ALL" | typeof STATUSES[number]>("ALL");
  const [pending, start] = useTransition();
  const visible = rows.filter((r) => filter === "ALL" || r.status === filter);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {["ALL", ...STATUSES].map((s) => (
          <button key={s} onClick={() => setFilter(s as any)}
            className={cn("rounded-full border px-4 py-1.5 text-[11px] uppercase tracking-luxe transition",
              filter === s ? "border-ink-900 bg-ink-900 text-ink-0 dark:border-ink-50 dark:bg-ink-50 dark:text-ink-900" : "border-ink-300/70 hover:border-ink-900 dark:border-ink-600")}>
            {s}
          </button>
        ))}
      </div>
      <div className="overflow-x-auto rounded-2xl border border-ink-200 dark:border-ink-700">
        <table className="w-full text-sm">
          <thead className="bg-ink-50 text-[10px] uppercase tracking-luxe text-ink-400 dark:bg-ink-800">
            <tr>
              <th className="px-4 py-3 text-left">Ref</th><th className="px-4 py-3 text-left">Client</th>
              <th className="px-4 py-3 text-left">Date</th><th className="px-4 py-3 text-left">Venue</th>
              <th className="px-4 py-3 text-left">Package</th><th className="px-4 py-3 text-left">Payment</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => (
              <tr key={r.id} className="border-t border-ink-200 dark:border-ink-700">
                <td className="px-4 py-3 font-mono text-xs">{r.reference}</td>
                <td className="px-4 py-3">
                  <div>{r.clientName}</div>
                  <a href={`https://wa.me/${r.clientPhone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-xs text-ink-400 hover:underline">{r.clientPhone}</a>
                </td>
                <td className="px-4 py-3">{format(new Date(r.date), "d MMM yyyy")}<div className="text-xs text-ink-400">{r.timeSlot}</div></td>
                <td className="px-4 py-3">{r.venue}</td>
                <td className="px-4 py-3 text-xs">{r.packageName ?? "—"}</td>
                <td className="px-4 py-3 text-xs">{r.paymentMethod ?? "—"}</td>
                <td className="px-4 py-3">
                  <select defaultValue={r.status} disabled={pending} onChange={(e) => start(() => updateBookingStatus(r.id, e.target.value))}
                    className="rounded-lg border border-ink-300 bg-transparent px-2 py-1 text-xs dark:border-ink-600">
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
