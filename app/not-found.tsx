import Link from "next/link";
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow mb-4">404</p>
      <h1 className="font-display text-6xl tracking-tightest">Lost frame</h1>
      <p className="mt-4 max-w-md text-ink-400">The page you're looking for is out of focus.</p>
      <Link href="/" className="btn-primary mt-10">Back home</Link>
    </div>
  );
}
