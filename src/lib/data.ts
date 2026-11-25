import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "@/lib/db";
import { SITE } from "@/lib/site";

export const CONTENT_TAG = "content";

export async function getBrands() {
  "use cache";
  cacheLife("hours");
  cacheTag(CONTENT_TAG);
  return db.brand.findMany({ orderBy: { order: "asc" } });
}

export async function getServices() {
  "use cache";
  cacheLife("hours");
  cacheTag(CONTENT_TAG);
  return db.service.findMany({ where: { status: "PUBLISHED" }, orderBy: { order: "asc" } });
}

export async function getProjects(take?: number) {
  "use cache";
  cacheLife("hours");
  cacheTag(CONTENT_TAG);
  return db.project.findMany({ where: { status: "PUBLISHED" }, orderBy: { year: "desc" }, take });
}

export async function getTestimonials() {
  "use cache";
  cacheLife("hours");
  cacheTag(CONTENT_TAG);
  return db.testimonial.findMany({ where: { visible: true }, orderBy: { order: "asc" } });
}

export async function getOffices() {
  "use cache";
  cacheLife("hours");
  cacheTag(CONTENT_TAG);
  return db.office.findMany({ orderBy: { order: "asc" } });
}

export type SiteData = {
  name: string;
  tagline: string;
  email: string;
  altEmail?: string;
  phones: string[];
  whatsapp: string;
};

export async function getSiteSettings(): Promise<SiteData> {
  "use cache";
  cacheLife("hours");
  cacheTag(CONTENT_TAG);
  const row = await db.siteSettings.findUnique({ where: { key: "site" } });
  const data = (row?.data ?? {}) as Partial<SiteData>;
  return {
    name: data.name ?? SITE.name,
    tagline: data.tagline ?? "Networking hardware, supplied and installed",
    email: data.email ?? SITE.email,
    altEmail: data.altEmail ?? SITE.altEmail,
    phones: data.phones ?? [...SITE.phones],
    whatsapp: data.whatsapp ?? SITE.whatsapp,
  };
}
