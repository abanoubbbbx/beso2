import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="mb-12 text-center">
          <p className="eyebrow mb-4">Client access</p>
          <h1 className="font-display text-5xl tracking-tightest">Welcome back</h1>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
