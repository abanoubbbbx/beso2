import Link from "next/link";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/admin/LogoutButton";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const s = await getSession();
  if (!s || s.role !== "ADMIN") redirect("/login");
  const nav = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/packages", label: "Packages" },
    { href: "/admin/orders", label: "Bookings" },
    { href: "/admin/availability", label: "Availability" },
    { href: "/admin/inquiries", label: "Inquiries" },
  ];
  return (
    <div className="min-h-screen">
      <header className="border-b border-ink-200 dark:border-ink-700">
        <div className="container flex items-center justify-between py-5">
          <div className="flex items-center gap-10">
            <Link href="/admin" className="font-display text-xl tracking-tightest">
              Beso<span className="text-accent">.</span> <span className="text-xs uppercase tracking-luxe text-ink-400 ml-2">Admin</span>
            </Link>
            <nav className="hidden gap-6 md:flex">
              {nav.map((n) => (
                <Link key={n.href} href={n.href} className="text-[11px] uppercase tracking-luxe text-ink-400 hover:text-ink-900 dark:hover:text-ink-50">{n.label}</Link>
              ))}
            </nav>
          </div>
          <LogoutButton />
        </div>
      </header>
      <main className="container py-12">{children}</main>
    </div>
  );
}
