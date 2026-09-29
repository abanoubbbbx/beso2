import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { BookingForm } from "@/components/booking/BookingForm";

export const metadata: Metadata = { title: "Book a session" };
export const dynamic = "force-dynamic";

export default async function BookingPage({ searchParams }: { searchParams: { package?: string } }) {
  const packages = await prisma.package.findMany({ where: { active: true }, orderBy: { order: "asc" }, select: { id: true, name: true, price: true, currency: true } });
  return (
    <div className="section">
      <div className="mb-16">
        <p className="eyebrow mb-4">Reserve</p>
        <h1 className="font-display text-6xl tracking-tightest md:text-7xl">Book your date</h1>
        <p className="mt-6 max-w-xl text-ink-400">Pick an open slot below. We'll confirm on WhatsApp within hours.</p>
      </div>
      <BookingForm packages={packages} preselectedSlug={searchParams.package} />
    </div>
  );
}
