"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { packageSchema } from "@/lib/schemas/package";

async function assertAdmin() {
  const s = await getSession();
  if (!s || s.role !== "ADMIN") throw new Error("Unauthorized");
}

export async function savePackage(input: unknown) {
  await assertAdmin();
  const data = packageSchema.parse(input);
  const payload = { slug: data.slug, name: data.name, tagline: data.tagline || null, price: data.price, duration: data.duration || null, features: data.features, highlighted: data.highlighted, active: data.active, order: data.order };
  if (data.id) await prisma.package.update({ where: { id: data.id }, data: payload });
  else await prisma.package.create({ data: payload });
  revalidatePath("/admin/packages"); revalidatePath("/packages"); revalidatePath("/");
}

export async function deletePackage(id: string) {
  await assertAdmin();
  await prisma.package.delete({ where: { id } });
  revalidatePath("/admin/packages"); revalidatePath("/packages"); revalidatePath("/");
}
