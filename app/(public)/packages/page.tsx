import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatEGP } from "@/lib/utils";

export const metadata: Metadata = { title: "Packages & Pricing" };
export const revalidate = 60;

export default async function PackagesPage() {
  const packages = await prisma.package.findMany({ where: { active: true }, orderBy: { order: "asc" } });

  return (
    <div className="section">
      <div className="mb-16 text-center">
        <p className="eyebrow mb-4">Collections</p>
        <h1 className="font-display text-6xl tracking-tightest md:text-7xl">Packages & Pricing</h1>
        <p className="mx-auto mt-6 max-w-xl text-ink-400">Every collection is a starting point. We'll tailor it to your day.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {packages.map((p) => (
          <div key={p.id}
            className={`relative flex flex-col rounded-3xl border p-8 transition-all duration-500 ${
              p.highlighted ? "border-ink-900 bg-ink-900 text-ink-0 dark:border-ink-50 dark:bg-ink-50 dark:text-ink-900"
                : "border-ink-200 hover:border-ink-900 dark:border-ink-700 dark:hover:border-ink-50"}`}>
            {p.highlighted && <p className="eyebrow mb-4 text-accent">Most loved</p>}
            <h2 className="font-display text-4xl tracking-tightest">{p.name}</h2>
            <p className="mt-2 text-sm opacity-70">{p.tagline}</p>
            <p className="mt-8 font-display text-5xl tracking-tightest">{formatEGP(p.price)}</p>
            {p.duration && <p className="mt-1 text-xs uppercase tracking-luxe opacity-60">{p.duration}</p>}
            <ul className="mt-8 flex-1 space-y-3 text-sm">
              {p.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-current opacity-40" />
                  <span className="opacity-80">{f}</span>
                </li>
              ))}
            </ul>
            <Link href={`/booking?package=${p.slug}`}
              className={p.highlighted ? "btn mt-8 bg-ink-0 text-ink-900 hover:bg-ink-200" : "btn-primary mt-8"}>
              Book this collection
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
