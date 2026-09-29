"use client";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function FAQ({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-ink-200 dark:divide-ink-700">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="py-6">
            <button onClick={() => setOpen(isOpen ? null : i)} className="flex w-full items-center justify-between text-left">
              <span className="font-display text-2xl tracking-tightest">{it.q}</span>
              {isOpen ? <Minus className="h-4 w-4 text-ink-400" /> : <Plus className="h-4 w-4 text-ink-400" />}
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                  <p className="pt-4 text-ink-500 dark:text-ink-300">{it.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
