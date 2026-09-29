"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, X } from "lucide-react";
import { PackageForm } from "./PackageForm";
import { formatEGP } from "@/lib/utils";
import type { Package } from "@prisma/client";

export function PackagesAdmin({ initial }: { initial: Package[] }) {
  const [editing, setEditing] = useState<Package | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <>
      <div className="mb-8">
        <button onClick={() => setCreating(true)} className="btn-primary"><Plus className="h-4 w-4" /> New package</button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {initial.map((p) => (
          <div key={p.id} className="group relative rounded-3xl border border-ink-200 p-6 dark:border-ink-700">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="eyebrow">{p.slug}</p>
                <h3 className="mt-1 font-display text-2xl tracking-tightest">{p.name}</h3>
              </div>
              <button onClick={() => setEditing(p)} className="rounded-full p-2 opacity-0 transition group-hover:opacity-100 hover:bg-ink-100 dark:hover:bg-ink-700"><Pencil className="h-4 w-4" /></button>
            </div>
            <p className="font-display text-3xl tracking-tightest">{formatEGP(p.price)}</p>
            <ul className="mt-4 space-y-1 text-sm text-ink-500 dark:text-ink-300">
              {p.features.slice(0, 4).map((f, i) => <li key={i}>· {f}</li>)}
            </ul>
            <div className="mt-6 flex gap-2 text-[10px] uppercase tracking-luxe">
              {p.highlighted && <span className="rounded-full bg-ink-900 px-3 py-1 text-ink-0 dark:bg-ink-50 dark:text-ink-900">Featured</span>}
              {!p.active && <span className="rounded-full border border-ink-300 px-3 py-1 text-ink-400">Archived</span>}
            </div>
          </div>
        ))}
      </div>
      <AnimatePresence>
        {(editing || creating) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/70 p-4 backdrop-blur-sm"
            onClick={() => { setEditing(null); setCreating(false); }}>
            <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-ink-0 p-8 shadow-luxe dark:bg-ink-800">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-display text-2xl tracking-tightest">{editing ? "Edit package" : "New package"}</h2>
                <button onClick={() => { setEditing(null); setCreating(false); }} className="rounded-full p-2 hover:bg-ink-100 dark:hover:bg-ink-700"><X className="h-5 w-5" /></button>
              </div>
              <PackageForm initial={editing ? { ...editing, tagline: editing.tagline ?? "", duration: editing.duration ?? "" } : undefined} onDone={() => { setEditing(null); setCreating(false); }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
