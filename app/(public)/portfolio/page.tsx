import type { Metadata } from "next";
import { PortfolioGallery } from "@/components/portfolio/PortfolioGallery";

export const metadata: Metadata = { title: "Portfolio" };

const ITEMS = [
  { id: "1", category: "Weddings", title: "Cairo · Amira & Youssef", src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80" },
  { id: "2", category: "Engagements", title: "Sahel Sunset", src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80" },
  { id: "3", category: "Portraits", title: "Studio · Quiet Light", src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80" },
  { id: "4", category: "Weddings", title: "Old Cairo Nights", src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&q=80" },
  { id: "5", category: "Engagements", title: "Desert Vows", src: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=1200&q=80" },
  { id: "6", category: "Portraits", title: "Editorial · Monochrome", src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=1200&q=80" },
  { id: "7", category: "Weddings", title: "Coastal Ceremony", src: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=1200&q=80" },
  { id: "8", category: "Portraits", title: "Bridal Study", src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80" },
];

export default function PortfolioPage() {
  return (
    <div className="section">
      <div className="mb-14">
        <p className="eyebrow mb-4">Selected work</p>
        <h1 className="font-display text-6xl tracking-tightest md:text-7xl">Portfolio</h1>
      </div>
      <PortfolioGallery items={ITEMS} />
    </div>
  );
}
