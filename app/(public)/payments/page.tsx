import type { Metadata } from "next";
import { CreditCard, Building2, Smartphone, Banknote } from "lucide-react";

export const metadata: Metadata = { title: "Payment Methods" };

const METHODS = [
  { icon: Smartphone, title: "InstaPay", desc: "Instant transfer via your bank app." },
  { icon: CreditCard, title: "Fawry", desc: "Pay cash at any Fawry outlet." },
  { icon: Smartphone, title: "Vodafone Cash", desc: "Send to our Vodafone Cash number." },
  { icon: Smartphone, title: "Orange Cash", desc: "Send via Orange Cash wallet." },
  { icon: Building2, title: "Bank Transfer", desc: "Direct transfer to business account." },
  { icon: Banknote, title: "Cash", desc: "Available for local bookings." },
];

export default function PaymentsPage() {
  return (
    <div className="section">
      <div className="mb-16 text-center">
        <p className="eyebrow mb-4">Secure & simple</p>
        <h1 className="font-display text-6xl tracking-tightest md:text-7xl">Payment methods</h1>
        <p className="mx-auto mt-6 max-w-xl text-ink-400">A 30% retainer confirms your date.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {METHODS.map((m) => (
          <div key={m.title} className="group rounded-3xl border border-ink-200 p-8 transition-all duration-500 hover:border-ink-900 dark:border-ink-700 dark:hover:border-ink-50">
            <m.icon className="mb-6 h-6 w-6 text-ink-400 group-hover:text-ink-900 dark:group-hover:text-ink-50" />
            <h2 className="font-display text-2xl tracking-tightest">{m.title}</h2>
            <p className="mt-3 text-sm text-ink-400">{m.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
