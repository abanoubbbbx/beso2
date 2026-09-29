import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { MyBookings } from "@/components/dashboard/MyBookings";
import { LogoutButton } from "@/components/admin/LogoutButton";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const bookings = await prisma.booking.findMany({
    where: {
      OR: [
        { userId: session.sub },
        { clientPhone: session.phone },
      ],
    },
    orderBy: { date: "desc" },
    include: { package: { select: { name: true } } },
  });

  return (
    <div className="section">
      <div className="mb-14 flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">My account</p>
          <h1 className="font-display text-5xl tracking-tightest">My Bookings</h1>
          <p className="mt-3 text-sm text-ink-400">{session.phone}</p>
        </div>
        <LogoutButton />
      </div>

      {bookings.length === 0 ? (
        <p className="text-ink-400">No bookings yet</p>
      ) : (
        <MyBookings
          bookings={bookings.map((b) => ({
            id: b.id,
            reference: b.reference,
            date: b.date.toISOString(),
            timeSlot: b.timeSlot,
            venue: b.venue,
            status: b.status,
            packageName: b.package?.name ?? null,
            guests: b.guests,
            paymentMethod: b.paymentMethod,
          }))}
        />
      )}
    </div>
  );
}