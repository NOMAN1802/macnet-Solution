/**
 * Replaces only the Testimonial collection with prisma/testimonials.ts. Other content and leads are untouched.
 * Writes a JSON backup of the current rows first (path given as the first argument, default ./testimonials-backup.json).
 * Run: pnpm db:testimonials [backup-path]
 */
import { writeFileSync } from "node:fs";
import { PrismaClient } from "@prisma/client";
import { TESTIMONIALS } from "../prisma/testimonials";

const db = new PrismaClient();

async function main() {
  const backup = process.argv[2] ?? "testimonials-backup.json";
  const current = await db.testimonial.findMany({ orderBy: { order: "asc" } });
  writeFileSync(backup, JSON.stringify(current, null, 2));
  console.log(`Backed up ${current.length} testimonials to ${backup}`);

  await db.$transaction([
    db.testimonial.deleteMany(),
    db.testimonial.createMany({ data: TESTIMONIALS.map((t, i) => ({ ...t, order: i })) }),
  ]);
  console.log(`Wrote ${TESTIMONIALS.length} testimonials`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
