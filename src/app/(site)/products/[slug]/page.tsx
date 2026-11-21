import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, getProductSlugs, getSiteSettings } from "@/lib/data";
import { whatsappLink } from "@/lib/site";
import { ProductCard } from "@/components/site/product-card";
import { StockLed } from "@/components/ui/stock-led";
import { ArrowRight, WhatsAppIcon } from "@/components/ui/icons";

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

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
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

  return (
    <>
      <div className="border-b border-rail-line">
        <nav aria-label="Breadcrumb" className="rack port flex flex-wrap items-center gap-2 py-4 uppercase text-text-muted">
          <Link href="/products" className="hover:text-ink">Products</Link>
          <span aria-hidden>/</span>
          <Link href={`/products?category=${product.category.slug}`} className="hover:text-ink">{product.category.name}</Link>
          <span aria-hidden>/</span>
          <span className="text-ink">{product.sku}</span>
        </nav>
      </div>

      <section className="rack grid gap-10 py-12 lg:grid-cols-12 lg:py-16">
        <div className="lg:col-span-7">
          <div className="relative border border-rail-line bg-white">
            {img ? (
              <Image src={img.url} alt={img.alt} width={img.width} height={img.height} priority sizes="(min-width: 1024px) 58vw, 100vw" className="h-auto w-full" />
            ) : null}
            <span className="port absolute left-4 top-4 uppercase text-text-muted">Fig. 01</span>
          </div>
        </div>

        <div className="lg:col-span-5">
          <p className="port uppercase text-signal-ink">
            <Link href={`/products?brand=${product.brand.slug}`} className="hover:underline">{product.brand.name}</Link>
          </p>
          <h1 className="heading mt-3 text-4xl text-ink md:text-5xl">{product.name}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-rail-line py-3">
            <span className="port uppercase text-text-muted">SKU <span className="text-text">{product.sku}</span></span>
            <StockLed stock={product.stock} className="text-text" />
          </div>
          <p className="mt-5 text-lg text-text">{product.pitch}</p>
          {paras.slice(1).map((p) => (
            <p key={p} className="mt-3 text-sm text-text-muted">{p}</p>
          ))}
          {product.isMock ? (
            <p className="port mt-4 inline-block border border-led-amber px-2 py-1 uppercase text-[#8a5a00]">Sample data · specs illustrative</p>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={`/quote?product=${product.slug}`} className="btn btn-primary">
              Request a quote <ArrowRight />
            </Link>
            <a
              href={whatsappLink(site.whatsapp, `Hello, I'd like a price for ${product.name} (SKU ${product.sku}).`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost text-ink"
            >
              <WhatsAppIcon className="h-4 w-4" /> Ask on WhatsApp
            </a>
          </div>
          <p className="mt-4 text-sm text-text-muted">Pricing and lead time are confirmed in your written quote.</p>
        </div>
      </section>

      <section className="border-t border-rail-line bg-white">
        <div className="rack grid gap-10 py-14 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <p className="port uppercase text-text-muted">Datasheet</p>
            <h2 className="heading mt-3 text-3xl text-ink">Specifications</h2>
            {product.datasheet ? (
              <a href={product.datasheet} className="btn btn-ghost mt-6 text-ink" target="_blank" rel="noopener noreferrer">Download PDF</a>
            ) : null}
          </div>
          <div className="lg:col-span-9">
            {Object.entries(groups).map(([group, rows]) => (
              <table key={group} className="mb-8 w-full border-collapse text-left">
                <caption className="port border-b border-ink pb-2 text-left uppercase text-ink">{group}</caption>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.label} className="border-b border-rail-line">
                      <th scope="row" className="w-2/5 py-3 pr-4 text-sm font-normal text-text-muted">{r.label}</th>
                      <td className="port py-3 text-[0.875rem] text-text">{r.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ))}
          </div>
        </div>
      </section>

      {related.length ? (
        <section className="border-t border-rail-line py-16">
          <div className="rack">
            <p className="port uppercase text-text-muted">More in {product.category.name}</p>
            <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
