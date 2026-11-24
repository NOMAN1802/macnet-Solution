import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getBrands, getCategories, getProducts, type ProductFilter } from "@/lib/data";
import { ProductCard } from "@/components/site/product-card";
import { PageBanner } from "@/components/site/page-banner";
import { ChevronRight, SearchIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Products",
  description: "Switches, routers, wireless access points, firewalls, fibre and cabling from Ubiquiti, Cisco, Tenda, Rosenberger and TP-Link.",
};

const STOCK = [
  { value: "", label: "Any availability" },
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
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-[30px]">
      <aside className="space-y-8 lg:col-span-4 xl:col-span-3" aria-label="Filters">
        <Widget title="Search" list={false}>
          <form action="/products" className="flex">
            {filter.category ? <input type="hidden" name="category" value={filter.category} /> : null}
            {filter.brand ? <input type="hidden" name="brand" value={filter.brand} /> : null}
            <label htmlFor="q" className="sr-only">Search products</label>
            <input id="q" name="q" defaultValue={filter.q} placeholder="Model or SKU" className="field" />
            <button className="grid h-[3.25rem] w-14 shrink-0 place-items-center bg-red text-white transition-colors hover:bg-heading" aria-label="Search">
              <SearchIcon className="h-5 w-5" />
            </button>
          </form>
        </Widget>

        <Widget title="Categories">
          <FilterLink href={href(filter, { category: undefined })} active={!filter.category}>All categories</FilterLink>
          {categories.map((c) => (
            <FilterLink key={c.id} href={href(filter, { category: c.slug })} active={filter.category === c.slug} count={c._count.products}>
              {c.name}
            </FilterLink>
          ))}
        </Widget>
        <Widget title="Brands">
          <FilterLink href={href(filter, { brand: undefined })} active={!filter.brand}>All brands</FilterLink>
          {brands.map((b) => (
            <FilterLink key={b.id} href={href(filter, { brand: b.slug })} active={filter.brand === b.slug} count={b._count.products}>
              {b.name}
            </FilterLink>
          ))}
        </Widget>
        <Widget title="Availability">
          {STOCK.map((s) => (
            <FilterLink key={s.value} href={href(filter, { stock: s.value || undefined })} active={(filter.stock ?? "") === s.value}>
              {s.label}
            </FilterLink>
          ))}
        </Widget>

        <div className="dot-pattern bg-red p-8 text-center text-white">
          <h2 className="text-2xl font-bold text-white">Need a model we don&apos;t list?</h2>
          <p className="mt-3 text-[0.9375rem] text-white/90">We source beyond this catalogue. Send the part number and we&apos;ll quote it.</p>
          <Link href="/quote" className="btn btn-white mt-6">Get a quote</Link>
        </div>
      </aside>

      <div className="lg:col-span-8 xl:col-span-9">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-5">
          <h2 className="text-xl font-semibold sm:text-2xl">
            {activeCategory?.name ?? "All products"}
            {activeBrand ? <span className="font-normal text-body">, {activeBrand.name}</span> : null}
            {filter.q ? <span className="font-normal text-body">, “{filter.q}”</span> : null}
          </h2>
          <p className="text-sm">
            {products.length} result{products.length === 1 ? "" : "s"}
            {hasFilter ? (
              <Link href="/products" className="link-more ml-4">Clear filters</Link>
            ) : null}
          </p>
        </div>
        {products.length ? (
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:gap-[30px] xl:grid-cols-3">
            {products.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="card-shadow mt-8 bg-white p-10 text-center">
            <h3 className="text-xl font-semibold">No products match these filters.</h3>
            <p className="mt-2">We source beyond this list. Ask us for the model you need.</p>
            <Link href="/quote" className="btn btn-red mt-6">Request a quote</Link>
          </div>
        )}
      </div>
    </div>
  );
}

function Widget({ title, list = true, children }: { title: string; list?: boolean; children: React.ReactNode }) {
  return (
    <section className="bg-mist p-7">
      <h2 className="relative pb-3 text-xl font-semibold after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-10 after:bg-red">{title}</h2>
      {list ? <ul className="mt-4">{children}</ul> : <div className="mt-5">{children}</div>}
    </section>
  );
}

function FilterLink({ href, active, count, children }: { href: string; active: boolean; count?: number; children: React.ReactNode }) {
  return (
    <li className="border-b border-line last:border-0">
      <Link
        href={href}
        aria-current={active ? "true" : undefined}
        className={`group flex items-center justify-between py-3 text-[0.9375rem] transition-colors duration-300 hover:text-red ${active ? "font-semibold text-red" : "text-heading"}`}
      >
        <span className="flex items-center gap-2.5">
          <ChevronRight className="h-3 w-3 text-red transition-transform duration-300 group-hover:translate-x-1" />
          {children}
        </span>
        {count !== undefined ? <span className="text-sm font-normal text-body">({count})</span> : null}
      </Link>
    </li>
  );
}

export default function ProductsPage({ searchParams }: PageProps<"/products">) {
  return (
    <>
      <PageBanner title="Products" crumbs={[{ label: "Products" }]} image="/images/banner-racks.jpg" />
      <section className="py-16 md:py-24">
        <div className="container-x">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="eyebrow">Catalogue</p>
            <h2 className="section-title mt-3">Networking Hardware From Five Brands</h2>
            <p className="mt-4">
              Browse by category or brand. No prices are listed. Add items to a quote request and we&apos;ll reply with pricing and lead times.
            </p>
          </div>
          <Suspense fallback={<p className="text-center">Loading catalogue…</p>}>
            <Catalogue searchParams={searchParams} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
