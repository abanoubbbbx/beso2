import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function PATCH(_: Request, { params }: { params: { id: string } }) {
  const s = await getSession();
  if (!s || s.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const inquiry = await prisma.inquiry.update({ where: { id: params.id }, data: { handled: true } });
  return NextResponse.json(inquiry);
}
