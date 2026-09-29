"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/packages", label: "Packages" },
  { href: "/booking", label: "Booking" },
  { href: "/payments", label: "Payments" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [path]);

  return (
    <>
      <header className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-500 ease-luxe",
        scrolled ? "bg-ink-0/85 dark:bg-ink-900/85 backdrop-blur-md py-3 border-b border-ink-200/50 dark:border-ink-700/50" : "py-6"
      )}>
        <div className="container flex items-center justify-between">
          <Link href="/" className="font-display text-xl tracking-tightest">
            Beso<span className="text-accent">.</span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href}
                className={cn("relative text-[11px] uppercase tracking-luxe transition-colors",
                  path === l.href ? "text-ink-900 dark:text-ink-50" : "text-ink-400 hover:text-ink-900 dark:hover:text-ink-50")}>
                {l.label}
              </Link>
            ))}
          </nav>
          <Link href="/booking" className="btn-primary hidden md:inline-flex">Book now</Link>
          <button onClick={() => setOpen(!open)} className="md:hidden rounded-full p-2" aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 bg-ink-0 pt-24 dark:bg-ink-900 md:hidden">
            <nav className="container flex flex-col gap-6 py-12">
              {LINKS.map((l, i) => (
                <motion.div key={l.href}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                  <Link href={l.href} className="font-display text-4xl tracking-tightest">{l.label}</Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
