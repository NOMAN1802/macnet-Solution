import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getBrands, getCategories, getProducts, type ProductFilter } from "@/lib/data";
import { ProductCard } from "@/components/site/product-card";
import { PortLabel } from "@/components/ui/port-label";

export const metadata: Metadata = {
  title: "Products",
  description: "Switches, routers, wireless access points, firewalls, fibre and cabling from Cisco, MikroTik, Ubiquiti, TP-Link, Ruijie and D-Link.",
};

const STOCK = [
  { value: "", label: "Any" },
  { value: "IN_STOCK", label: "In stock" },
  { value: "ON_ORDER", label: "On order" },
];

function href(current: ProductFilter, patch: Partial<ProductFilter>) {
  const next = { ...current, ...patch };
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(next)) if (v) sp.set(k, v);
  const s = sp.toString();
  return s ? `/products?${s}` : "/products";
}

function pick(v: string | string[] | undefined) {
  return (Array.isArray(v) ? v[0] : v)?.slice(0, 80) || undefined;
}

async function Catalogue({ searchParams }: { searchParams: PageProps<"/products">["searchParams"] }) {
  const sp = await searchParams;
  const filter: ProductFilter = { category: pick(sp.category), brand: pick(sp.brand), stock: pick(sp.stock), q: pick(sp.q) };
  const [categories, brands, products] = await Promise.all([getCategories(), getBrands(), getProducts(filter)]);
  const activeCategory = categories.find((c) => c.slug === filter.category);
  const activeBrand = brands.find((b) => b.slug === filter.brand);
  const hasFilter = Boolean(filter.category || filter.brand || filter.stock || filter.q);

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <aside className="lg:col-span-3" aria-label="Filters">
        <form action="/products" className="flex">
          {filter.category ? <input type="hidden" name="category" value={filter.category} /> : null}
          {filter.brand ? <input type="hidden" name="brand" value={filter.brand} /> : null}
          <label htmlFor="q" className="sr-only">Search products</label>
          <input id="q" name="q" defaultValue={filter.q} placeholder="Search model or SKU" className="field" />
          <button className="btn btn-primary h-11 px-4">Go</button>
        </form>

        <FilterGroup title="Category">
          <FilterLink href={href(filter, { category: undefined })} active={!filter.category}>All categories</FilterLink>
          {categories.map((c) => (
            <FilterLink key={c.id} href={href(filter, { category: c.slug })} active={filter.category === c.slug} count={c._count.products}>
              {c.name}
            </FilterLink>
          ))}
        </FilterGroup>
        <FilterGroup title="Brand">
          <FilterLink href={href(filter, { brand: undefined })} active={!filter.brand}>All brands</FilterLink>
          {brands.map((b) => (
            <FilterLink key={b.id} href={href(filter, { brand: b.slug })} active={filter.brand === b.slug} count={b._count.products}>
              {b.name}
            </FilterLink>
          ))}
        </FilterGroup>
        <FilterGroup title="Availability">
          {STOCK.map((s) => (
            <FilterLink key={s.value} href={href(filter, { stock: s.value || undefined })} active={(filter.stock ?? "") === s.value}>
              {s.label}
            </FilterLink>
          ))}
        </FilterGroup>
      </aside>

      <div className="lg:col-span-9">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-ink pb-4">
          <p className="heading text-xl text-ink">
            {activeCategory?.name ?? "All products"}
            {activeBrand ? <span className="text-text-muted"> · {activeBrand.name}</span> : null}
            {filter.q ? <span className="text-text-muted"> · “{filter.q}”</span> : null}
          </p>
          <p className="port uppercase text-text-muted">
            {products.length} result{products.length === 1 ? "" : "s"}
            {hasFilter ? (
              <Link href="/products" className="ml-4 text-signal-ink underline underline-offset-4">Clear filters</Link>
            ) : null}
          </p>
        </div>
        {products.length ? (
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-8 border border-dashed border-rail p-10 text-center">
            <p className="heading text-xl text-ink">No products match these filters.</p>
            <p className="mt-2 text-text-muted">We source beyond this list. Ask us for the model you need.</p>
            <Link href="/quote" className="btn btn-primary mt-6">Request a quote</Link>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-8">
      <p className="port uppercase text-text-muted">{title}</p>
      <ul className="mt-3 border-t border-rail-line">{children}</ul>
    </div>
  );
}

function FilterLink({ href, active, count, children }: { href: string; active: boolean; count?: number; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        aria-current={active ? "true" : undefined}
        className={`flex items-center justify-between border-b border-rail-line py-2.5 text-[0.9375rem] transition-colors ${active ? "font-semibold text-ink" : "text-text-muted hover:text-ink"}`}
      >
        <span className="flex items-center gap-2">
          <span aria-hidden className={`h-1.5 w-1.5 ${active ? "bg-signal" : "bg-transparent"}`} />
          {children}
        </span>
        {count !== undefined ? <span className="port text-rail">{count}</span> : null}
      </Link>
    </li>
  );
}

export default function ProductsPage({ searchParams }: PageProps<"/products">) {
  return (
    <>
      <section className="border-b border-rail-line">
        <div className="rack rails py-12 md:py-16">
          <PortLabel port="P-01">Catalogue</PortLabel>
          <h1 className="display mt-5 text-5xl text-ink md:text-7xl">Products</h1>
          <p className="mt-4 max-w-2xl text-lg text-text-muted">
            Browse by category or brand. No prices are listed. Add items to a quote request and we&apos;ll reply with pricing and lead times.
          </p>
        </div>
      </section>
      <div className="rack py-12">
        <Suspense fallback={<p className="port uppercase text-text-muted">Loading catalogue…</p>}>
          <Catalogue searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}
