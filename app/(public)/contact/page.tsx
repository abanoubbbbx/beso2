import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { MessageCircle, Mail, Instagram } from "lucide-react";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="section grid gap-16 lg:grid-cols-2">
      <div>
        <p className="eyebrow mb-4">Say hello</p>
        <h1 className="font-display text-6xl tracking-tightest md:text-7xl">Get in touch</h1>
        <p className="mt-6 max-w-md text-ink-400">Fill the form and we'll open WhatsApp with your message ready.</p>
        <div className="mt-12 space-y-4 text-sm">
          <a href="https://wa.me/201001234567" className="flex items-center gap-3 text-ink-400 hover:text-ink-900 dark:hover:text-ink-50"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
          <a href="mailto:hello@beso.studio" className="flex items-center gap-3 text-ink-400 hover:text-ink-900 dark:hover:text-ink-50"><Mail className="h-4 w-4" /> hello@beso.studio</a>
          <a href="https://instagram.com" className="flex items-center gap-3 text-ink-400 hover:text-ink-900 dark:hover:text-ink-50"><Instagram className="h-4 w-4" /> @beso.studio</a>
        </div>
      </div>
      <ContactForm />
    </div>
  );
}
