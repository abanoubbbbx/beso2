import { prisma } from "@/lib/prisma";
import { PackagesAdmin } from "@/components/admin/PackagesAdmin";
export const dynamic = "force-dynamic";

export default async function AdminPackagesPage() {
  const packages = await prisma.package.findMany({ orderBy: { order: "asc" } });
  return (
    <div>
      <h1 className="mb-10 font-display text-5xl tracking-tightest">Packages</h1>
      <PackagesAdmin initial={packages} />
    </div>
  );
}
