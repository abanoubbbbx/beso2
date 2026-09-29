"use client";
import { useTransition } from "react";
import { formatInTimeZone } from "date-fns-tz";
import { Check } from "lucide-react";

type Row = { id: string; name: string; phone: string; message: string; preferredDate: Date | null; handled: boolean; createdAt: Date };

export function InquiriesTable({ rows }: { rows: Row[] }) {
  const [pending, start] = useTransition();

  const toggle = (id: string) => start(async () => {
    await fetch(`/api/inquiries/${id}`, { method: "PATCH" });
    window.location.reload();
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {rows.map((r) => (
        <div key={r.id} className={`rounded-3xl border p-6 ${r.handled ? "border-ink-200 opacity-60 dark:border-ink-700" : "border-ink-900 dark:border-ink-50"}`}>
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="font-display text-xl tracking-tightest">{r.name}</p>
              <a href={`https://wa.me/${r.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-xs text-ink-400 hover:underline">{r.phone}</a>
            </div>
            {!r.handled && (
              <button onClick={() => toggle(r.id)} disabled={pending} className="rounded-full bg-ink-900 p-2 text-ink-0 dark:bg-ink-50 dark:text-ink-900" title="Mark handled">
                <Check className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <p className="text-sm text-ink-500 dark:text-ink-300">{r.message}</p>
          <div className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-luxe text-ink-400">
            <span>{formatInTimeZone(new Date(r.createdAt), "Africa/Cairo", "d MMM · HH:mm")}</span>
            {r.preferredDate && <span>{formatInTimeZone(new Date(r.preferredDate), "Africa/Cairo", "d MMM")}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
