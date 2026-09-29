"use client";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { eachDayOfInterval, endOfMonth, format, startOfMonth, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const SLOTS = ["10:00", "14:00", "18:00"];
type Row = { date: string; timeSlot: string; status: "OPEN" | "BLOCKED" };

export function AvailabilityManager() {
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [pending, start] = useTransition();

  const range = useMemo(() => ({ from: format(startOfMonth(cursor), "yyyy-MM-dd"), to: format(endOfMonth(cursor), "yyyy-MM-dd") }), [cursor]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/availability?from=${range.from}&to=${range.to}`, { cache: "no-store" });
      const json = await res.json();
      const flat: Row[] = [];
      json.days.forEach((d: any) => d.slots.forEach((s: any) => flat.push({ date: d.date, timeSlot: s.time, status: s.status })));
      setRows(flat);
    } finally { setLoading(false); }
  }, [range]);

  useEffect(() => { load(); }, [load]);

  const map = useMemo(() => { const m = new Map<string, Row>(); rows.forEach((r) => m.set(`${r.date}|${r.timeSlot}`, r)); return m; }, [rows]);

  const toggle = (date: string, slot: string) => start(async () => {
    const current = map.get(`${date}|${slot}`)?.status ?? "OPEN";
    const next = current === "OPEN" ? "BLOCKED" : "OPEN";
    await fetch("/api/availability", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ date, timeSlot: slot, status: next }) });
    await load();
  });

  const days = eachDayOfInterval({ start: startOfMonth(cursor), end: endOfMonth(cursor) });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <button onClick={() => setCursor(subMonths(cursor, 1))} className="rounded-full p-2 hover:bg-ink-100 dark:hover:bg-ink-700"><ChevronLeft className="h-5 w-5" /></button>
        <h3 className="font-display text-2xl tracking-tightest">{format(cursor, "MMMM yyyy")}</h3>
        <button onClick={() => setCursor(addMonths(cursor, 1))} className="rounded-full p-2 hover:bg-ink-100 dark:hover:bg-ink-700"><ChevronRight className="h-5 w-5" /></button>
      </div>
      {loading && <div className="mb-4 flex items-center gap-2 text-xs text-ink-400"><Loader2 className="h-3 w-3 animate-spin" /> Loading…</div>}
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          return (
            <div key={key} className="rounded-2xl border border-ink-200 p-4 dark:border-ink-700">
              <div className="mb-3 flex items-center justify-between">
                <span className="eyebrow">{format(day, "EEE")}</span>
                <span className="font-display text-lg">{format(day, "d")}</span>
              </div>
              <div className="space-y-1.5">
                {SLOTS.map((slot) => {
                  const status = map.get(`${key}|${slot}`)?.status ?? "OPEN";
                  const blocked = status === "BLOCKED";
                  return (
                    <button key={slot} onClick={() => toggle(key, slot)} disabled={pending}
                      className={cn("flex w-full items-center justify-between rounded-full px-3 py-1.5 text-xs transition",
                        blocked ? "bg-ink-900 text-ink-0 dark:bg-ink-50 dark:text-ink-900" : "border border-ink-200 hover:border-ink-900 dark:border-ink-600 dark:hover:border-ink-50")}>
                      <span>{slot}</span>
                      <span className="text-[10px] uppercase tracking-luxe">{blocked ? "Blocked" : "Open"}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
