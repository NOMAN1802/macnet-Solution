import type { Metadata } from "next";
import { Suspense } from "react";
import { getProductsBySlugs, getSiteSettings } from "@/lib/data";
import { telLink, whatsappLink } from "@/lib/site";
import { LeadForm } from "@/components/site/lead-form";
import { PortLabel } from "@/components/ui/port-label";

export const metadata: Metadata = {
  title: "Request a quote",
  description: "Send Macnet Solutions your product list or requirement and get a written quote with pricing and lead times.",
};

async function QuoteForm({ searchParams }: { searchParams: PageProps<"/quote">["searchParams"] }) {
  const sp = await searchParams;
  const raw = sp.product;
  const slugs = (Array.isArray(raw) ? raw : raw ? [raw] : []).slice(0, 20).map((s) => s.slice(0, 120));
  const [products, site] = await Promise.all([getProductsBySlugs(slugs), getSiteSettings()]);
  return <LeadForm type="QUOTE" products={products} whatsapp={site.whatsapp} source={slugs.length ? "product-page" : "quote-page"} />;
}

export default async function QuotePage({ searchParams }: PageProps<"/quote">) {
  const site = await getSiteSettings();
  return (
    <section className="rack grid gap-12 py-12 md:py-16 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <PortLabel port="Q-01">Request a quote</PortLabel>
        <h1 className="display mt-5 text-5xl text-ink md:text-6xl">Tell us what you need.</h1>
        <p className="mt-5 text-lg text-text-muted">
          List models and quantities, or describe the site and the problem. We reply with a written quote, lead times and installation options.
        </p>
        <ol className="mt-10 border-t border-ink">
          {["We review your list and check stock with suppliers.", "An engineer confirms anything unclear by phone.", "You get a written quote, usually within one working day."].map((step, i) => (
            <li key={step} className="flex gap-4 border-b border-rail-line py-4">
              <span className="port text-signal-ink">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-sm">{step}</span>
            </li>
          ))}
        </ol>
        <div className="mt-8 space-y-1 text-sm">
          <p className="port uppercase text-text-muted">Prefer to talk?</p>
          <p>
            <a href={whatsappLink(site.whatsapp)} target="_blank" rel="noopener noreferrer" className="text-signal-ink underline underline-offset-4">WhatsApp {site.whatsapp}</a>
          </p>
          {site.phones.map((p) => (
            <p key={p}>
              <a href={telLink(p)} className="port hover:text-ink">{p}</a>
            </p>
          ))}
        </div>
      </div>
      <div className="lg:col-span-8">
        <Suspense fallback={<div className="h-[560px] border border-rail-line bg-white" aria-hidden />}>
          <QuoteForm searchParams={searchParams} />
        </Suspense>
      </div>
    </section>
  );
}
