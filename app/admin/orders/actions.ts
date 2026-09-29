"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function updateBookingStatus(id: string, status: string) {
  const s = await getSession();
  if (!s || s.role !== "ADMIN") throw new Error("Unauthorized");
  await prisma.booking.update({ where: { id }, data: { status: status as any } });
  revalidatePath("/admin/orders");
}
