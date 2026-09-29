import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const DEFAULT_SLOTS = ["10:00", "14:00", "18:00"];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from"), to = searchParams.get("to");
  if (!from || !to) return NextResponse.json({ error: "from/to required" }, { status: 400 });

  const fromDate = new Date(`${from}T00:00:00.000Z`);
  const toDate = new Date(`${to}T23:59:59.999Z`);

  const [avail, bookings] = await Promise.all([
    prisma.availability.findMany({ where: { date: { gte: fromDate, lte: toDate } } }),
    prisma.booking.findMany({
      where: { date: { gte: fromDate, lte: toDate }, status: { in: ["PENDING", "CONFIRMED", "COMPLETED"] } },
      select: { date: true, timeSlot: true },
    }),
  ]);

  const availMap = new Map(avail.map((a) => [`${a.date.toISOString().slice(0, 10)}|${a.timeSlot}`, a.status]));
  const bookedSet = new Set(bookings.map((b) => `${b.date.toISOString().slice(0, 10)}|${b.timeSlot}`));

  const days: { date: string; slots: { time: string; status: string; booked: boolean }[] }[] = [];
  const cursor = new Date(fromDate);
  while (cursor <= toDate) {
    const key = cursor.toISOString().slice(0, 10);
    days.push({
      date: key,
      slots: DEFAULT_SLOTS.map((time) => ({
        time, status: availMap.get(`${key}|${time}`) ?? "OPEN", booked: bookedSet.has(`${key}|${time}`),
      })),
    });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return NextResponse.json({ days });
}

export async function POST(req: Request) {
  const s = await getSession();
  if (!s || s.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { date, timeSlot, status } = await req.json();
  const dateObj = new Date(`${date}T00:00:00.000Z`);
  const row = await prisma.availability.upsert({
    where: { date_timeSlot: { date: dateObj, timeSlot } }, update: { status }, create: { date: dateObj, timeSlot, status },
  });
  return NextResponse.json(row);
}
