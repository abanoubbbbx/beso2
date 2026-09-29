"use client";
import { useRouter } from "next/navigation";
export function LogoutButton() {
  const router = useRouter();
  return (
    <button onClick={async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); router.refresh(); }}
      className="text-[11px] uppercase tracking-luxe text-ink-400 hover:text-ink-900 dark:hover:text-ink-50">
      Logout
    </button>
  );
}
