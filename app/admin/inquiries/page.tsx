import { prisma } from "@/lib/prisma";
import { InquiriesTable } from "@/components/admin/InquiriesTable";
export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  const inquiries = await prisma.inquiry.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 className="mb-10 font-display text-5xl tracking-tightest">Inquiries</h1>
      {inquiries.length === 0 ? <p className="text-ink-400">No inquiries yet.</p> : <InquiriesTable rows={inquiries} />}
    </div>
  );
}
