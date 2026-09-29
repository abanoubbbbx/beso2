import Link from "next/link";
import { Instagram, Mail, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-ink-200 dark:border-ink-700">
      <div className="container grid gap-12 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-3xl tracking-tightest">Weddings by Beso</p>
          <p className="mt-4 max-w-md text-sm text-ink-400">
            Timeless, editorial photography. Documenting love stories across Egypt and beyond.
          </p>
        </div>
        <div>
          <p className="eyebrow mb-4">Explore</p>
          <ul className="space-y-2 text-sm">
            {["Portfolio","Packages","Booking","FAQ"].map((l) => (
              <li key={l}><Link href={`/${l.toLowerCase()}`} className="text-ink-400 hover:text-ink-900 dark:hover:text-ink-50 transition-colors">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-4">Reach out</p>
          <ul className="space-y-3 text-sm">
            <li><a href="https://wa.me/201017302646" className="flex items-center gap-2 text-ink-400 hover:text-ink-900 dark:hover:text-ink-50"><MessageCircle className="h-4 w-4" /> WhatsApp</a></li>
            <li><a href="mailto:hello@beso.studio" className="flex items-center gap-2 text-ink-400 hover:text-ink-900 dark:hover:text-ink-50"><Mail className="h-4 w-4" /> Email</a></li>
            <li><a href="https://instagram.com" className="flex items-center gap-2 text-ink-400 hover:text-ink-900 dark:hover:text-ink-50"><Instagram className="h-4 w-4" /> Instagram</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-200 dark:border-ink-700">
        <div className="container flex flex-col items-center justify-between gap-3 py-6 text-[11px] uppercase tracking-luxe text-ink-400 sm:flex-row">
          <span suppressHydrationWarning>© {new Date().getFullYear()} Weddings by Beso</span>
          <Link href="/login" className="hover:text-ink-900 dark:hover:text-ink-50">Client login</Link>
        </div>
      </div>
    </footer>
  );
}
