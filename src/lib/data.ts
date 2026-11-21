import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { SITE } from "@/lib/site";

export const CATALOG_TAG = "catalog";
export const CONTENT_TAG = "content";

const productCard = {
  id: true,
  name: true,
  slug: true,
  sku: true,
  pitch: true,
  stock: true,
  featured: true,
  isMock: true,
  images: true,
  specs: true,
  brand: { select: { name: true, slug: true } },
  category: { select: { name: true, slug: true } },
} satisfies Prisma.ProductSelect;

export type ProductCard = Prisma.ProductGetPayload<{ select: typeof productCard }>;

export async function getCategories() {
  "use cache";
  cacheLife("hours");
  cacheTag(CATALOG_TAG);
  return db.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { products: { where: { status: "PUBLISHED" } } } } },
  });
}

export async function getBrands() {
  "use cache";
  cacheLife("hours");
  cacheTag(CATALOG_TAG);
  return db.brand.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { products: { where: { status: "PUBLISHED" } } } } },
  });
}

export async function getFeaturedProducts(take = 6) {
  "use cache";
  cacheLife("hours");
  cacheTag(CATALOG_TAG);
  return db.product.findMany({
    where: { status: "PUBLISHED", featured: true },
    select: productCard,
    orderBy: { updatedAt: "desc" },
    take,
  });
}

export type ProductFilter = { category?: string; brand?: string; q?: string; stock?: string };

export async function getProducts(filter: ProductFilter) {
  "use cache";
  cacheLife("hours");
  cacheTag(CATALOG_TAG);
  const where: Prisma.ProductWhereInput = { status: "PUBLISHED" };
  if (filter.category) where.category = { slug: filter.category };
  if (filter.brand) where.brand = { slug: filter.brand };
  if (filter.stock === "IN_STOCK" || filter.stock === "ON_ORDER") where.stock = filter.stock;
  if (filter.q) {
    where.OR = [
      { name: { contains: filter.q, mode: "insensitive" } },
      { sku: { contains: filter.q, mode: "insensitive" } },
      { pitch: { contains: filter.q, mode: "insensitive" } },
    ];
  }
  return db.product.findMany({
    where,
    select: productCard,
    orderBy: [{ featured: "desc" }, { name: "asc" }],
  });
}

export async function getProductSlugs() {
  "use cache";
  cacheLife("hours");
  cacheTag(CATALOG_TAG);
  return db.product.findMany({ where: { status: "PUBLISHED" }, select: { slug: true } });
}

export async function getProduct(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(CATALOG_TAG);
  const product = await db.product.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { brand: true, category: true, projects: { select: { title: true, slug: true, sector: true } } },
  });
  if (!product) return null;
  const related = await db.product.findMany({
    where: { status: "PUBLISHED", categoryId: product.categoryId, id: { not: product.id } },
    select: productCard,
    take: 3,
  });
  return { product, related };
}

export async function getProductsBySlugs(slugs: string[]) {
  "use cache";
  cacheLife("hours");
  cacheTag(CATALOG_TAG);
  if (slugs.length === 0) return [];
  return db.product.findMany({
    where: { slug: { in: slugs }, status: "PUBLISHED" },
    select: { id: true, name: true, sku: true },
  });
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
