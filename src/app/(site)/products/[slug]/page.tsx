import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getProduct, getProductSlugs, getSiteSettings } from "@/lib/data";
import { whatsappLink } from "@/lib/site";
import { ProductCard } from "@/components/site/product-card";
import { PageBanner } from "@/components/site/page-banner";
import { StockLed } from "@/components/ui/stock-led";
import { Reveal } from "@/components/ui/reveal";
import { ArrowRight, BarcodeIcon, ClockIcon, LayersIcon, TagIcon, WhatsAppIcon } from "@/components/ui/icons";

export async function generateStaticParams() {
  const rows = await getProductSlugs();
  return rows.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProduct(slug);
  if (!data) return { title: "Product not found" };
  const { product } = data;
  return { title: product.seo?.title ?? product.name, description: product.seo?.description ?? product.pitch };
}

type DocNode = { type: string; text?: string; content?: DocNode[] };
function plainParagraphs(body: unknown): string[] {
  const root = body as DocNode | null;
  if (!root?.content) return [];
  return root.content.map((n) => (n.content ?? []).map((c) => c.text ?? "").join("")).filter(Boolean);
}

type Params = PageProps<"/products/[slug]">["params"];

/** Shown while a product that was not prerendered streams in. Known slugs are prerendered via generateStaticParams. */
function ProductFallback() {
  return (
    <>
      <PageBanner title="Products" image="/images/banner-desk.jpg" crumbs={[{ label: "Products", href: "/products" }]} />
      <section className="py-16 md:py-24" aria-busy="true" aria-label="Loading product">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-[30px]">
          <div className="card-shadow aspect-[4/3] animate-pulse bg-mist lg:col-span-7" />
          <div className="space-y-4 lg:col-span-5 lg:pl-4">
            <div className="h-4 w-24 animate-pulse bg-mist" />
            <div className="h-9 w-3/4 animate-pulse bg-mist" />
            <div className="h-20 w-full animate-pulse bg-mist" />
          </div>
        </div>
      </section>
    </>
  );
}

export default function ProductPage({ params }: PageProps<"/products/[slug]">) {
  return (
    <Suspense fallback={<ProductFallback />}>
      <ProductDetail params={params} />
    </Suspense>
  );
}

async function ProductDetail({ params }: { params: Params }) {
  const { slug } = await params;
  const [data, site] = await Promise.all([getProduct(slug), getSiteSettings()]);
  if (!data) notFound();
  const { product, related } = data;
  const img = product.images[0];
  const groups = product.specs.reduce<Record<string, typeof product.specs>>((acc, s) => {
    (acc[s.group] ??= []).push(s);
    return acc;
  }, {});
  const paras = plainParagraphs(product.body);

  const meta = [
    { icon: TagIcon, label: "Brand", value: <Link href={`/products?brand=${product.brand.slug}`} className="hover:text-red">{product.brand.name}</Link> },
    { icon: LayersIcon, label: "Category", value: <Link href={`/products?category=${product.category.slug}`} className="hover:text-red">{product.category.name}</Link> },
    { icon: BarcodeIcon, label: "SKU", value: product.sku },
    { icon: ClockIcon, label: "Availability", value: <StockLed stock={product.stock} className="text-body" /> },
  ];

  return (
    <>
      <PageBanner
        title={product.name}
        image="/images/banner-desk.jpg"
        crumbs={[
          { label: "Products", href: "/products" },
          { label: product.category.name, href: `/products?category=${product.category.slug}` },
          { label: product.sku },
        ]}
      />

      <section className="py-16 md:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-[30px]">
          <Reveal from="left" className="lg:col-span-7">
            <div className="card-shadow overflow-hidden bg-white">
              {img ? (
                <Image src={img.url} alt={img.alt} width={img.width} height={img.height} loading="eager" fetchPriority="high" sizes="(min-width: 1024px) 58vw, 100vw" className="h-auto w-full" />
              ) : null}
            </div>
          </Reveal>

          <Reveal from="right" className="lg:col-span-5 lg:pl-4">
            <p className="eyebrow">{product.brand.name}</p>
            <h2 className="mt-3 text-[1.75rem] font-bold sm:text-[2rem]">{product.name}</h2>
            <p className="mt-4">{product.pitch}</p>

            <dl className="mt-7 grid gap-6 sm:grid-cols-2">
              {meta.map((m) => (
                <div key={m.label} className="flex gap-4">
                  <m.icon className="h-8 w-8 shrink-0 text-red" />
                  <div>
                    <dt className="font-display text-[1.0625rem] font-semibold text-heading">{m.label}</dt>
                    <dd className="mt-0.5 text-[0.9375rem]">{m.value}</dd>
                  </div>
                </div>
              ))}
            </dl>

            {product.isMock ? (
              <p className="mt-6 inline-block border-l-4 border-led-amber bg-[#fff7e8] px-3 py-2 text-sm text-[#7a5200]">Sample data. Specs are illustrative.</p>
            ) : null}

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/quote?product=${product.slug}`} className="btn btn-red">
                Request a quote <ArrowRight />
              </Link>
              <a
                href={whatsappLink(site.whatsapp, `Hello, I'd like a price for ${product.name} (SKU ${product.sku}).`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost text-heading"
              >
                <WhatsAppIcon className="h-4 w-4" /> Ask on WhatsApp
              </a>
            </div>
            <p className="mt-4 text-sm">Pricing and lead time are confirmed in your written quote.</p>
          </Reveal>
        </div>

        <div className="container-x mt-16 grid gap-12 lg:grid-cols-12 lg:gap-[30px]">
          <Reveal className="lg:col-span-5">
            <h2 className="text-2xl font-bold">Overview</h2>
            {(paras.length ? paras : [product.pitch]).map((p) => (
              <p key={p} className="mt-4">{p}</p>
            ))}
            {product.datasheet ? (
              <a href={product.datasheet} className="btn btn-ghost mt-7 text-heading" target="_blank" rel="noopener noreferrer">
                Download datasheet
              </a>
            ) : null}
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-7">
            <h2 className="text-2xl font-bold">Specifications</h2>
            <div className="mt-6 space-y-8">
              {Object.entries(groups).map(([group, rows]) => (
                <table key={group} className="card-shadow w-full border-collapse bg-white text-left">
                  <caption className="bg-red px-5 py-3 text-left font-display text-[0.9375rem] font-semibold text-white">{group}</caption>
                  <tbody>
                    {rows.map((r, i) => (
                      <tr key={r.label} className={i % 2 ? "bg-mist" : "bg-white"}>
                        <th scope="row" className="w-2/5 px-5 py-3 align-top text-[0.9375rem] font-medium text-heading">{r.label}</th>
                        <td className="px-5 py-3 text-[0.9375rem]">{r.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {related.length ? (
        <section className="bg-mist py-20 md:py-24">
          <div className="container-x">
            <Reveal className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">Related</p>
              <h2 className="section-title mt-3">More in {product.category.name}</h2>
            </Reveal>
            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[30px]">
              {related.map((p, i) => (
                <Reveal as="li" key={p.id} delay={i * 0.12}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
