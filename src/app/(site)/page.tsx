import Link from "next/link";
import { getBrands, getCategories, getFeaturedProducts, getProjects, getServices, getSiteSettings, getTestimonials } from "@/lib/data";
import { whatsappLink } from "@/lib/site";
import { HeroVisual } from "@/components/three/hero-visual";
import { ProductCard } from "@/components/site/product-card";
import { PortLabel, SectionHeading } from "@/components/ui/port-label";
import { Reveal } from "@/components/ui/reveal";
import { ArrowRight, WhatsAppIcon } from "@/components/ui/icons";

export default async function HomePage() {
  const [site, brands, categories, featured, services, projects, testimonials] = await Promise.all([
    getSiteSettings(),
    getBrands(),
    getCategories(),
    getFeaturedProducts(6),
    getServices(),
    getProjects(3),
    getTestimonials(),
  ]);
  const productCount = categories.reduce((n, c) => n + c._count.products, 0);

  return (
    <>
      {/* P-00 Hero */}
      <section className="relative overflow-hidden bg-rack text-paper">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="rack grid h-full grid-cols-6 md:grid-cols-12">
            {Array.from({ length: 12 }).map((_, i) => (
              <span key={i} className={`border-l border-rail-line-dark ${i >= 6 ? "hidden md:block" : ""}`} />
            ))}
          </div>
        </div>
        <div className="rack relative grid items-center gap-8 pb-14 pt-14 md:pt-20 lg:grid-cols-12 lg:pb-20">
          <div className="lg:col-span-6">
            <PortLabel port="P-00" tone="paper">
              Networking hardware · Dhaka
            </PortLabel>
            <h1 className="display mt-6 text-[3.25rem] sm:text-[4.5rem] lg:text-[5.25rem]">
              Switches, routers and Wi-Fi.
              <span className="block text-signal">Supplied, cabled, running.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-rail">
              Macnet Solutions supplies equipment from {brands.map((b) => b.name).join(", ").replace(/, ([^,]*)$/, " and $1")}, then designs,
              cables, installs and supports the network around it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/products" className="btn btn-signal">
                Browse products <ArrowRight />
              </Link>
              <Link href="/quote" className="btn btn-ghost text-paper">
                Request a quote
              </Link>
            </div>
            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-rail-line-dark pt-5">
              {[
                [String(brands.length), "brands"],
                [`${productCount}`, "products"],
                ["2", "Dhaka offices"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="port uppercase text-rail">{l}</dt>
                  <dd className="display mt-1 text-3xl">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="lg:col-span-6">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* P-01 Brands */}
      <section aria-labelledby="brands-title" className="border-b border-rail-line">
        <div className="rack rails grid gap-6 py-8 md:grid-cols-12 md:items-center">
          <p id="brands-title" className="port uppercase text-text-muted md:col-span-2">
            P-01 · Brands
          </p>
          <ul className="grid grid-cols-2 border-l border-t border-rail-line sm:grid-cols-3 md:col-span-10 lg:grid-cols-6">
            {brands.map((b) => (
              <li key={b.id} className="border-b border-r border-rail-line">
                <Link
                  href={`/products?brand=${b.slug}`}
                  className="flex h-16 items-center justify-between px-4 text-ink transition-colors hover:bg-white"
                >
                  <span className="heading text-lg">{b.name}</span>
                  <span className="port text-rail">{b._count.products}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* P-02 Categories as rack units */}
      <section className="py-20 md:py-28">
        <div className="rack">
          <SectionHeading
            port="P-02"
            label="Product range"
            title="Everything from the edge switch to the rack it sits in."
            intro="Six product lines, stocked or sourced to order. Every listing shows stock status. Prices are quoted per order."
          />
          <ol className="mt-12 border-t border-ink">
            {categories.map((c, i) => (
              <Reveal as="li" key={c.id} delay={i * 0.04}>
                <Link
                  href={`/products?category=${c.slug}`}
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-rail-line py-5 transition-colors hover:bg-white md:grid-cols-[6rem_1fr_1.4fr_6rem_2rem] md:gap-6 md:px-3"
                >
                  <span className="port flex items-center gap-2 text-text-muted">
                    <span aria-hidden className="h-2 w-2 bg-rail-line transition-colors group-hover:bg-signal" />U-{String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="heading text-xl text-ink md:text-2xl">{c.name}</span>
                  <span className="hidden text-sm text-text-muted md:block">{c.description}</span>
                  <span className="port text-right text-text-muted">{c._count.products} items</span>
                  <ArrowRight className="hidden h-4 w-4 text-ink transition-transform group-hover:translate-x-1 md:block" />
                </Link>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* P-03 Featured */}
      <section className="border-y border-rail-line bg-paper-2/60 py-20 md:py-28">
        <div className="rack">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading port="P-03" label="Featured" title="Popular with our clients" />
            <Link href="/products" className="btn btn-ghost text-ink">
              All products <ArrowRight />
            </Link>
          </div>
          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <Reveal as="li" key={p.id} delay={(i % 3) * 0.06}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* P-04 Services */}
      <section id="services" className="scroll-mt-20 py-20 md:py-28">
        <div className="rack">
          <SectionHeading
            port="P-04"
            label="Services"
            title="We don't just ship boxes."
            intro="Most orders come with design, cabling or installation. Pick one service or the whole job."
          />
          <ol className="mt-12 grid border-l border-t border-rail-line md:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <Reveal as="li" key={s.id} delay={i * 0.06} className="flex flex-col border-b border-r border-rail-line bg-white p-6">
                <span className="display text-5xl text-rail-line">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="heading mt-6 text-xl text-ink">{s.title}</h3>
                <p className="mt-3 text-sm text-text-muted">{s.summary}</p>
                <ul className="mt-5 space-y-2 border-t border-rail-line pt-4">
                  {s.points.map((pt) => (
                    <li key={pt} className="flex gap-2 text-sm">
                      <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-signal" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* P-05 Projects */}
      <section id="projects" className="scroll-mt-20 bg-rack py-20 text-paper md:py-28">
        <div className="rack">
          <SectionHeading
            port="P-05"
            label="Projects"
            tone="paper"
            title="Recent installs"
            intro="Sample case studies for now. Real client work will be published here."
          />
          <ul className="mt-12 grid gap-px bg-rail-line-dark md:grid-cols-3">
            {projects.map((p, i) => (
              <Reveal as="li" key={p.id} delay={i * 0.06} className="flex flex-col bg-rack p-6 md:p-8">
                <p className="port uppercase text-signal">
                  {p.sector} · {p.year}
                </p>
                <h3 className="heading mt-3 text-2xl">{p.title}</h3>
                <p className="mt-3 flex-1 text-sm text-rail">{p.summary}</p>
                <dl className="mt-8 grid grid-cols-3 gap-3 border-t border-rail-line-dark pt-5">
                  {p.results.map((r) => (
                    <div key={r.label}>
                      <dd className="display text-2xl">{r.value}</dd>
                      <dt className="port mt-1 min-h-[2.6em] text-[0.6875rem] uppercase text-rail">{r.label}</dt>
                    </div>
                  ))}
                </dl>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* P-06 Testimonials */}
      <section className="py-20 md:py-28">
        <div className="rack">
          <SectionHeading port="P-06" label="Clients" title="What clients say" intro="Sample testimonials until client quotes are approved." />
          <ul className="mt-12 grid gap-x-10 md:grid-cols-2">
            {testimonials.map((t, i) => (
              <Reveal as="li" key={t.id} delay={(i % 2) * 0.06} className="border-t border-ink py-8">
                <blockquote className="heading text-2xl text-ink">“{t.quote}”</blockquote>
                <p className="port mt-5 uppercase text-text-muted">
                  {t.name} · {t.role}, {t.company}
                </p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* P-07 CTA */}
      <section className="border-t border-rail-line bg-ink text-paper">
        <div className="rack grid gap-8 py-16 md:grid-cols-12 md:items-center md:py-20">
          <div className="md:col-span-7">
            <PortLabel port="P-07" tone="paper">
              Request a quote
            </PortLabel>
            <h2 className="display mt-5 text-4xl md:text-6xl">Send us your list. We&apos;ll price it.</h2>
            <p className="mt-4 max-w-lg text-[#c9c9e0]">
              Share model numbers, a bill of materials or just the problem you need solved. We usually reply within one working day.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:col-span-5 md:justify-end">
            <Link href="/quote" className="btn btn-signal">
              Request a quote <ArrowRight />
            </Link>
            <a href={whatsappLink(site.whatsapp)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost text-paper">
              <WhatsAppIcon className="h-4 w-4" /> WhatsApp us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
