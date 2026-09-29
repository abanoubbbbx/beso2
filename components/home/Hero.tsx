"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden">
      <div className="absolute inset-0">
        <Image src="https://images.unsplash.com/photo-1519741497674-611481863552?w=2400&q=80"
          alt="" fill priority sizes="100vw"
          className="object-cover grayscale-0 md:grayscale" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/60 via-ink-950/40 to-ink-950/90" />
      </div>
      <div className="container relative z-10 text-ink-0">
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="eyebrow mb-6 text-ink-200">Photography · Egypt & Worldwide</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl font-display text-6xl leading-[1.02] tracking-tightest sm:text-7xl md:text-8xl">
          Every love story,<br /><em className="font-light italic text-ink-200">quietly</em> immortalized.
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 max-w-lg text-base text-ink-200">
          A monochrome editorial approach to weddings — clean, timeless, and unmistakably yours.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 flex flex-wrap gap-4">
          <Link href="/booking" className="btn bg-ink-0 text-ink-900 hover:bg-ink-200">Reserve your date</Link>
          <Link href="/portfolio" className="btn border border-ink-0/40 text-ink-0 hover:border-ink-0">View portfolio</Link>
        </motion.div>
      </div>
    </section>
  );
}
