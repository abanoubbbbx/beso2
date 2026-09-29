"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = { id: string; src: string; category: string; title: string };
const CATEGORIES = ["All", "Weddings", "Engagements", "Portraits"] as const;

export function PortfolioGallery({ items }: { items: Item[] }) {
  const [filter, setFilter] = useState<string>("All");
  const [active, setActive] = useState<Item | null>(null);
  const [revealed, setRevealed] = useState<string | null>(null);

  // 🔒 قفل السكرول لما الـ lightbox مفتوح
  useEffect(() => {
    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [active]);

  const visible = filter === "All" ? items : items.filter((i) => i.category === filter);

  return (
    <>
      {/* فلتر الفئات */}
      <div className="mb-10 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={cn(
              "rounded-full border px-5 py-2 text-[11px] uppercase tracking-luxe transition-all duration-300",
              filter === c
                ? "border-ink-900 bg-ink-900 text-ink-0 dark:border-ink-50 dark:bg-ink-50 dark:text-ink-900"
                : "border-ink-300/70 hover:border-ink-900 dark:border-ink-600 dark:hover:border-ink-50"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {/* شبكة الصور */}
      <motion.div layout className="columns-2 gap-3 md:columns-3 lg:columns-4">
        <AnimatePresence>
          {visible.map((item) => (
            <motion.button
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => {
                // لو الصورة منوّرة، افتح الـ lightbox مباشرة
                if (revealed === item.id) {
                  setActive(item);
                  setRevealed(null);
                  return;
                }
                // نوّن الصورة + استنى 400ms + افتح الـ lightbox
                setRevealed(item.id);
                setTimeout(() => {
                  setActive(item);
                  setRevealed(null);
                }, 400);
              }}
              className="group relative mb-3 block w-full overflow-hidden rounded-xl"
            >
              <Image
                src={item.src}
                alt={item.title}
                width={800}
                height={1000}
                sizes="(max-width:768px) 50vw, 25vw"
                className={`w-full object-cover transition-all duration-500 ease-luxe ${
                  revealed === item.id
                    ? "grayscale-0 scale-105"
                    : "grayscale group-hover:grayscale-0 group-hover:scale-105"
                }`}
              />
              {/* شريط العنوان على الصورة */}
              <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-ink-950/90 to-transparent p-4 text-left transition-transform duration-500 ease-luxe group-hover:translate-y-0">
                <p className="eyebrow text-ink-200">{item.category}</p>
                <p className="mt-1 font-display text-xl tracking-tightest text-ink-0">
                  {item.title}
                </p>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* الـ Lightbox */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/95 p-4"
            onClick={() => setActive(null)}
          >
            <button
              className="absolute right-6 top-6 rounded-full p-2 text-ink-0 hover:bg-ink-0/10"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-5xl"
            >
              <Image
                src={active.src}
                alt={active.title}
                width={1600}
                height={2000}
                className="max-h-[90vh] w-full rounded-2xl object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}