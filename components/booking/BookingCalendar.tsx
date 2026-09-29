"use client";
import { useMemo, useState } from "react";
import { addMonths, eachDayOfInterval, endOfMonth, format, isBefore, isSameDay, isSameMonth, startOfDay, startOfMonth, subMonths } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type DayAvailability = { date: string; slots: { time: string; status: "OPEN" | "BLOCKED"; booked: boolean }[] };
type Props = {
  monthData: DayAvailability[]; selectedDate: Date | null; selectedSlot: string | null;
  onSelectDate: (d: Date) => void; onSelectSlot: (slot: string) => void;
  onMonthChange: (from: string, to: string) => void; loading?: boolean;
};
const WEEKDAYS = ["S","M","T","W","T","F","S"];

export function BookingCalendar({ monthData, selectedDate, selectedSlot, onSelectDate, onSelectSlot, onMonthChange, loading }: Props) {
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));
  const today = startOfDay(new Date());
  const map = useMemo(() => { const m = new Map<string, DayAvailability>(); monthData.forEach((d) => m.set(d.date, d)); return m; }, [monthData]);
  const days = useMemo(() => eachDayOfInterval({ start: startOfMonth(cursor), end: endOfMonth(cursor) }), [cursor]);

  const shift = (delta: number) => {
    const next = delta > 0 ? addMonths(cursor, 1) : subMonths(cursor, 1);
    setCursor(next);
    onMonthChange(format(startOfMonth(next), "yyyy-MM-dd"), format(endOfMonth(next), "yyyy-MM-dd"));
  };

  const selectedDaySlots = selectedDate ? map.get(format(selectedDate, "yyyy-MM-dd"))?.slots ?? [] : [];

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <button type="button" onClick={() => shift(-1)} className="rounded-full p-2 text-ink-400 transition hover:bg-ink-100 hover:text-ink-900 dark:hover:bg-ink-700 dark:hover:text-ink-50" aria-label="Previous month"><ChevronLeft className="h-5 w-5" /></button>
        <motion.h3 key={format(cursor, "yyyy-MM")} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="font-display text-2xl tracking-tightest">
          {format(cursor, "MMMM yyyy")}
        </motion.h3>
        <button type="button" onClick={() => shift(1)} className="rounded-full p-2 text-ink-400 transition hover:bg-ink-100 hover:text-ink-900 dark:hover:bg-ink-700 dark:hover:text-ink-50" aria-label="Next month"><ChevronRight className="h-5 w-5" /></button>
      </div>
      <div className="grid grid-cols-7 gap-1 pb-2 text-center text-[10px] uppercase tracking-luxe text-ink-300">
        {WEEKDAYS.map((d, i) => <div key={i}>{d}</div>)}
      </div>
      <div className={cn("grid grid-cols-7 gap-1", loading && "opacity-50")}>
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const entry = map.get(key);
          const isPast = isBefore(day, today);
          const hasOpen = !!entry?.slots.some((s) => s.status === "OPEN" && !s.booked);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const disabled = isPast || !hasOpen;
          return (
            <button key={key} type="button" disabled={disabled} onClick={() => onSelectDate(day)}
              className={cn(
                "relative flex aspect-square items-center justify-center rounded-lg text-sm transition-all duration-300 ease-luxe",
                disabled && "cursor-not-allowed text-ink-300/60",
                !disabled && !isSelected && "hover:bg-ink-100 dark:hover:bg-ink-700",
                isSelected && "bg-ink-900 text-ink-0 dark:bg-ink-50 dark:text-ink-900",
                !isSameMonth(day, cursor) && "opacity-30"
              )}>
              {format(day, "d")}
              {hasOpen && !isSelected && <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-ink-900 dark:bg-ink-50" />}
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        {selectedDate && (
          <motion.div key={format(selectedDate, "yyyy-MM-dd")}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="mt-8">
            <p className="mb-3 eyebrow">Available times · {format(selectedDate, "EEE, d MMM")}</p>
            <div className="flex flex-wrap gap-2">
              {selectedDaySlots.filter((s) => s.status === "OPEN" && !s.booked).length === 0 && <p className="text-sm text-ink-400">No open slots on this date.</p>}
              {selectedDaySlots.filter((s) => s.status === "OPEN" && !s.booked).map((s) => {
                const active = selectedSlot === s.time;
                return (
                  <button key={s.time} type="button" onClick={() => onSelectSlot(s.time)}
                    className={cn(
                      "rounded-full border px-5 py-2 text-xs uppercase tracking-luxe transition-all duration-300 ease-luxe",
                      active ? "border-ink-900 bg-ink-900 text-ink-0 dark:border-ink-50 dark:bg-ink-50 dark:text-ink-900"
                        : "border-ink-300/70 hover:border-ink-900 dark:border-ink-600 dark:hover:border-ink-50"
                    )}>{s.time}</button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
