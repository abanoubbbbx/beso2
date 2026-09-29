import type { Metadata } from "next";
import { FAQ } from "@/components/ui/FAQ";

export const metadata: Metadata = { title: "FAQ" };

export default function FAQPage() {
  return (
    <div className="section max-w-3xl">
      <p className="eyebrow mb-4">Answers</p>
      <h1 className="mb-14 font-display text-6xl tracking-tightest md:text-7xl">Frequently asked</h1>
      <FAQ items={[
        { q: "How far in advance should I book?", a: "For peak season (May–September), we recommend 6–12 months ahead. Off-season dates can often be secured within 4–6 weeks." },
        { q: "How do we secure our date?", a: "A 30% retainer locks in your date. Remainder due two weeks before. InstaPay, Fawry, Vodafone Cash, Orange Cash, bank transfer, or cash." },
        { q: "When will we receive the photos?", a: "Preview within 7 days, full gallery in 4–6 weeks, albums in 8 weeks." },
        { q: "Can we customize a package?", a: "Yes. Every collection is a starting point." },
        { q: "Do you shoot in black and white only?", a: "No — full colour. Our edits lean timeless with a monochrome soul." },
      ]} />
    </div>
  );
}
