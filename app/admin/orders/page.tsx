import { prisma } from "@/lib/prisma";
import { OrdersTable } from "@/components/admin/OrdersTable";
export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const bookings = await prisma.booking.findMany({ orderBy: { createdAt: "desc" }, include: { package: { select: { name: true } } } });
  const rows = bookings.map((b) => ({
    id: b.id, reference: b.reference, clientName: b.clientName, clientPhone: b.clientPhone,
    date: b.date, timeSlot: b.timeSlot, venue: b.venue, status: b.status,
    paymentMethod: b.paymentMethod, packageName: b.package?.name ?? null,
  }));
  return (
    <div>
      <h1 className="mb-10 font-display text-5xl tracking-tightest">Bookings</h1>
      <OrdersTable rows={rows} />
    </div>
  );
}
