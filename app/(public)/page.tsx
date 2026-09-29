import Link from "next/link";
import Image from "next/image";
import { Hero } from "@/components/home/Hero";
import { prisma } from "@/lib/prisma";
import { formatEGP } from "@/lib/utils";
import { FeatureImage } from "@/components/home/FeatureImage";

export const revalidate = 3600;

export default async function HomePage() {
  const packages = await prisma.package.findMany({ where: { active: true }, orderBy: { order: "asc" }, take: 3 });

  return (
    <>
      <Hero />
      <section className="section max-w-3xl text-center">
        <p className="eyebrow mb-6">The studio</p>
        <h2 className="font-display text-4xl leading-tight tracking-tightest md:text-5xl">
          We believe the most beautiful moments are the ones you almost missed.
        </h2>
      </section>
<section className="container">
  <div className="grid gap-4 md:grid-cols-3">
    {["f1.jpg", "f2.jpg", "f3.jpg"].map((filename) => (
  <FeatureImage
    key={filename}
    src={`${process.env.NEXT_SUPABASE_IMAGES_URL}/${filename}`}
    alt="Wedding photography"
  />
))}
  </div>
</section>
      <section className="section">
        <div className="mb-14 text-center">
          <p className="eyebrow mb-4">Collections</p>
          <h2 className="font-display text-5xl tracking-tightest">Choose your story</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {packages.map((p) => (
            <div key={p.id} className="group rounded-3xl border border-ink-200 p-8 transition-all duration-500 hover:border-ink-900 dark:border-ink-700 dark:hover:border-ink-50">
              {p.highlighted && <p className="eyebrow mb-4 text-accent">Most loved</p>}
              <h3 className="font-display text-3xl tracking-tightest">{p.name}</h3>
              <p className="mt-2 text-sm text-ink-400">{p.tagline}</p>
              <p className="mt-6 font-display text-4xl tracking-tightest">{formatEGP(p.price)}</p>
              <ul className="mt-6 space-y-2 text-sm text-ink-500 dark:text-ink-300">
                {p.features.slice(0, 4).map((f, i) => <li key={i}>· {f}</li>)}
              </ul>
              <Link href="/booking" className="btn-ghost mt-8 w-full">Book this</Link>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/packages" className="text-xs uppercase tracking-luxe underline underline-offset-8">Compare all packages</Link>
        </div>
      </section>
    </>
  );
}
