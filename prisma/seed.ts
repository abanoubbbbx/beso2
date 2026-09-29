import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { phone: "201001234567" },
    update: { role: "ADMIN", name: "Beso Admin" },
    create: { phone: "201001234567", role: "ADMIN", name: "Beso Admin" },
  });

  const packages = [
    { slug: "essential", name: "Essential", tagline: "Perfect for intimate ceremonies", price: 15000, duration: "6 hours", order: 1, highlighted: false,
      features: ["6 hours coverage", "200 edited photos", "Online gallery", "1 photographer", "Digital delivery"] },
    { slug: "signature", name: "Signature", tagline: "Our most-loved collection", price: 32000, duration: "10 hours", order: 2, highlighted: true,
      features: ["10 hours coverage", "500 edited photos", "Engagement session", "2 photographers", "Premium album", "Drone coverage"] },
    { slug: "legacy", name: "Legacy", tagline: "The full cinematic experience", price: 55000, duration: "Full day + afterparty", order: 3, highlighted: false,
      features: ["Full day coverage", "1000+ edited photos", "4K cinematic film", "3-person crew", "Two premium albums", "Drone + gimbal", "Same-day preview"] },
  ];

  for (const p of packages) {
    await prisma.package.upsert({ where: { slug: p.slug }, update: p, create: p });
  }
  console.log("✅ Seed complete");
}
main().finally(() => prisma.$disconnect());
