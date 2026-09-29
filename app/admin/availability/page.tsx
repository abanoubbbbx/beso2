import { AvailabilityManager } from "@/components/admin/AvailabilityManager";

export default function AdminAvailabilityPage() {
  return (
    <div>
      <h1 className="mb-4 font-display text-5xl tracking-tightest">Availability</h1>
      <p className="mb-10 text-sm text-ink-400">Tap a slot to toggle between open and blocked.</p>
      <AvailabilityManager />
    </div>
  );
}
