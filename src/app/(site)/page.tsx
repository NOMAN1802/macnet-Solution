import Image from "next/image";
import Link from "next/link";
import { getBrands, getProjects, getServices, getSiteSettings, getTestimonials } from "@/lib/data";
import { BRAND_LOGOS, CLIENTS, whatsappLink } from "@/lib/site";
import { HeroSlider } from "@/components/site/hero-slider";
import { TestimonialSlider } from "@/components/site/testimonial-slider";
import { LeadForm } from "@/components/site/lead-form";
import { PlayButton } from "@/components/site/video-modal";
import { Reveal } from "@/components/ui/reveal";
import { Counter } from "@/components/ui/counter";
import {
  ArrowRight,
  CheckIcon,
  HeadsetIcon,
  QuoteIcon,
  RackIcon,
  RouterIcon,
  ServiceIcon,
  SwitchIcon,
  WhatsAppIcon,
} from "@/components/ui/icons";

const PROJECT_IMAGES = ["/images/project-laptop.jpg", "/images/project-fibre.jpg", "/images/project-engineer.jpg"];
const PROJECT_ICONS = [SwitchIcon, RackIcon, RouterIcon];

function ProjectIcon({ index }: { index: number }) {
  const Icon = PROJECT_ICONS[index % PROJECT_ICONS.length];
  return <Icon className="h-10 w-10 shrink-0" />;
}

export default async function HomePage() {
  const [site, brands, services, projects, testimonials] = await Promise.all([
    getSiteSettings(),
    getBrands(),
    getServices(),
    getProjects(3),
    getTestimonials(),
  ]);
  const brandList = brands
    .map((b) => b.name)
    .join(", ")
    .replace(/, ([^,]*)$/, " and $1");

  return (
    <>
      <HeroSlider brands={brandList} />

      {/* Feature cards overlapping the hero */}
      <section aria-label="Why Macnet" className="relative z-10 -mt-24 lg:-mt-[110px]">
        <div className="container-x grid gap-6 md:grid-cols-3 lg:gap-[30px]">
          <Reveal className="h-full">
            <div className="fill-card card-shadow flex h-full flex-col items-center px-7 py-10 text-center">
              <RouterIcon className="fc-icon h-12 w-12 text-red" />
              <h3 className="fc-title mt-5 text-[1.375rem] font-semibold">Five brands, one order</h3>
              <p className="fc-text mt-3 text-[0.9375rem]">Mix {brandList} on a single quote, with lead times confirmed in writing.</p>
            </div>
          </Reveal>
          <Reveal delay={0.15} className="h-full">
            <div className="fill-card card-shadow flex h-full flex-col items-center px-7 py-10 text-center">
              <HeadsetIcon className="fc-icon h-12 w-12 text-red" />
              <h3 className="fc-title mt-5 text-[1.375rem] font-semibold">Install & AMC support</h3>
              <p className="fc-text mt-3 text-[0.9375rem]">Our engineers rack, configure and hand over the network, then support it under contract.</p>
            </div>
          </Reveal>
          <Reveal delay={0.3} className="h-full">
            <div className="card-shadow flex h-full flex-col items-center bg-red px-7 py-10 text-center text-white">
              <h3 className="text-[1.375rem] font-semibold text-white">Custom request</h3>
              <p className="mt-3 text-[0.9375rem] text-white/90">
                Send model numbers, a bill of materials or just the problem. We reply with a written quote.
              </p>
              <Link href="/quote" className="btn btn-white mt-6 min-h-11 px-6 text-xs">
                Get a quote <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* About */}
      <section id="about" className="scroll-mt-24 py-20 md:py-28">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-[70px]">
          <Reveal from="left" className="relative pb-10 pr-6 sm:pr-10">
            <div className="relative aspect-[5/6] overflow-hidden sm:aspect-[4/4.4]">
              <Image
                src="/images/about-engineer-rack.jpg"
                alt="Network engineer checking a rack switch on his laptop"
                fill
                sizes="(min-width: 1024px) 540px, 100vw"
                className="object-cover"
              />
            </div>
            <figure className="absolute bottom-0 right-0 w-[80%] max-w-[340px] bg-red p-6 text-white sm:p-8">
              <QuoteIcon className="absolute right-5 top-4 h-10 w-10 text-white/90" />
              <blockquote className="pr-8 font-display text-base font-semibold italic leading-relaxed sm:text-lg">
                We plan every cut-over around your working hours, so the business keeps running while the network changes.
              </blockquote>
              <figcaption className="mt-4 text-sm text-white/85">Macnet engineering team</figcaption>
              <span aria-hidden className="absolute -left-[34px] bottom-0 h-[40px] w-[34px] bg-red [clip-path:polygon(100%_0,100%_100%,0_100%)]" />
            </figure>
          </Reveal>

          <Reveal from="right">
            <p className="eyebrow">About us</p>
            <h2 className="section-title mt-3">Your Networking Partner From Survey to Support</h2>
            <p className="mt-5">
              Macnet Solutions supplies networking equipment from {brandList}, then designs, cables, installs and supports the network
              around it from our office in Dhaka.
            </p>
            <blockquote className="mt-7 border-l-[3px] border-red pl-6">
              <p className="font-display font-semibold italic text-heading">
                One supplier for the switch, the rack it sits in, the cabling behind it and the people who keep it running.
              </p>
              <p className="mt-3">Most orders come with design, cabling or installation. Pick one service or hand us the whole job.</p>
            </blockquote>
            <Link href="/quote" className="btn btn-red mt-8">
              Get a quote
            </Link>
            <ul className="mt-8 space-y-3">
              {["Written quotes, usually within one working day", "Engineers who configure before delivery", "Annual maintenance contracts with set response times"].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <CheckIcon className="mt-1 h-4 w-4 shrink-0 text-red" />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <div className="container-x">
        <hr className="border-line" />
      </div>

      {/* Services */}
      <section id="services" className="scroll-mt-24 py-20 md:py-28">
        <div className="container-x grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-[30px]">
          <Reveal className="flex flex-col justify-center pb-4 sm:col-span-2 lg:col-span-1 lg:pr-6">
            <p className="eyebrow">Our services</p>
            <h2 className="section-title mt-3">Design, Cabling & Installation</h2>
            <p className="mt-4">We don&apos;t just ship boxes. Pick one service or the whole job, from the first survey to the support contract.</p>
            <div>
              <Link href="/contact" className="btn btn-red mt-7">
                Talk to an engineer
              </Link>
            </div>
          </Reveal>
          {services.map((s, i) => (
            <Reveal key={s.id} delay={(i % 3) * 0.12} className="h-full">
              <div className="fill-card card-shadow flex h-full flex-col items-center px-7 py-10 text-center">
                <ServiceIcon index={i} className="fc-icon h-12 w-12 text-red" />
                <h3 className="fc-title mt-5 text-[1.375rem] font-semibold">{s.title}</h3>
                <p className="fc-text mt-3 text-[0.9375rem]">{s.summary}</p>
                <Link href="/quote" className="link-more mt-5">
                  Get a quote <ArrowRight className="h-3.5 w-3.5" />
                  <span className="sr-only"> for {s.title.toLowerCase()}</span>
                </Link>
              </div>
            </Reveal>
          ))}
          <Reveal delay={0.24} className="relative min-h-[260px] overflow-hidden">
            <Image src="/images/services-team-dhaka.jpg" alt="Engineers working on laptops in a Dhaka office" fill sizes="(min-width: 1024px) 380px, 100vw" className="object-cover" />
            <div className="absolute inset-0 grid place-items-center bg-heading/25">
              <PlayButton className="h-[70px] w-[70px]" iconClassName="ml-1 h-6 w-6" label="Play our video" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Testimonials split */}
      <section aria-labelledby="clients-title" className="grid lg:grid-cols-2">
        <div className="relative min-h-[420px] overflow-hidden lg:min-h-[600px]">
          <Image src="/images/clients-office-laptop.jpg" alt="Client smiling at his laptop in a modern office" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          <Reveal from="left" className="absolute bottom-0 left-0 w-[86%] max-w-[300px] bg-red p-7 text-white sm:p-8">
            <h3 className="text-2xl font-bold text-white">Our Dhaka office</h3>
            <p className="mt-3 text-[0.9375rem] text-white/90">
              Visit us at Haque Chamber, 89/2 Panthapath (Suite 3A) to see equipment and talk to an engineer.
            </p>
            <Link href="/contact" className="mt-5 inline-flex items-center gap-2 font-display text-xs font-semibold uppercase tracking-[0.1em] text-white hover:underline">
              Find us <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Reveal>
        </div>
        <div className="dot-pattern flex min-w-0 items-center bg-red px-6 py-16 text-center sm:px-12 lg:px-16 lg:py-20">
          <Reveal className="mx-auto w-full min-w-0 max-w-xl">
            <h2 id="clients-title" className="text-[1.875rem] font-bold text-white sm:text-[2.375rem]">What Clients Say About Us</h2>
            <div className="mt-8">
              <TestimonialSlider items={testimonials} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="scroll-mt-24 py-20 md:py-28">
        <div className="container-x">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Case studies</p>
            <h2 className="section-title mt-3">Network Projects & Installs</h2>
            <p className="mt-4">Sample case studies for now. Real client work will be published here as clients approve it.</p>
          </Reveal>
          <ul className="mt-14 grid gap-6 md:grid-cols-3 lg:gap-[30px]">
            {projects.map((p, i) => (
              <Reveal as="li" key={p.id} delay={i * 0.15}>
                <article className="card-shadow hover-zoom group flex h-full flex-col bg-white">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={PROJECT_IMAGES[i % PROJECT_IMAGES.length]}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-4 bg-red px-6 py-4 text-white">
                    <ProjectIcon index={i} />
                    <div>
                      <h3 className="font-display text-lg font-semibold leading-snug text-white">{p.title}</h3>
                      <p className="text-sm text-white/85">
                        {p.sector}, {p.year}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col px-6 pb-7 pt-5">
                    <p className="text-[0.9375rem]">{p.summary}</p>
                    <dl className="mt-auto grid grid-cols-3 gap-3 border-t border-line pt-5">
                      {p.results.map((r) => (
                        <div key={r.label} className="flex flex-col-reverse">
                          <dt className="text-xs leading-snug">{r.label}</dt>
                          <dd className="font-display text-xl font-bold text-red">{r.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
          <Reveal className="mt-12 text-center text-[0.9375rem]">
            Planning something similar?
            <Link href="/quote" className="link-more ml-3">
              Get a quote <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Contact band with overlapping quote card */}
      <section aria-labelledby="cta-title" className="relative">
        <div className="relative isolate overflow-hidden bg-navy pb-44 pt-20 text-center md:pb-52 md:pt-28">
          <Image src="/images/cta-patch-panel.jpg" alt="" fill sizes="100vw" className="-z-20 object-cover" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-[#0e1117]/80" />
          <Reveal className="container-x">
            <h2 id="cta-title" className="mx-auto max-w-3xl text-[1.875rem] font-bold leading-tight text-white sm:text-[2.625rem]">
              Don&apos;t Wait on a Slow Network. Send Us Your List and We&apos;ll Price It.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-white/85">
              Share model numbers, a bill of materials or just the problem you need solved. We usually reply within one working day.
            </p>
          </Reveal>
        </div>
        <div className="container-x relative z-10 -mt-32 md:-mt-36">
          <Reveal className="card-shadow grid lg:grid-cols-[42%_1fr]">
            <div className="relative isolate overflow-hidden bg-red px-7 py-12 text-white sm:px-10 lg:py-14">
              <Image src="/images/quote-rack-cables.jpg" alt="" fill sizes="(min-width: 1024px) 480px, 100vw" className="-z-20 object-cover opacity-25 mix-blend-luminosity" />
              <div aria-hidden className="absolute inset-0 -z-10 bg-red/80" />
              <h3 className="text-[1.75rem] font-bold leading-tight text-white sm:text-[2.125rem]">One Supplier for the Whole Network</h3>
              <p className="mt-5 text-white/95">
                Hardware, cabling, installation and support on one quote, with lead times confirmed in writing before you order.
              </p>
              <ul className="mt-7 space-y-3">
                {["Mixed-brand orders on a single quote", "Stock checked with suppliers first", "Engineer review of anything unclear", "Installation and AMC options included"].map((t) => (
                  <li key={t} className="flex items-start gap-3 text-white">
                    <CheckIcon className="mt-1 h-4 w-4 shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-9 flex flex-wrap items-center gap-5">
                <Link href="/contact" className="btn btn-white">
                  Contact us
                </Link>
                <a
                  href={whatsappLink(site.whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-display text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-white hover:underline"
                >
                  <WhatsAppIcon className="h-4 w-4" /> WhatsApp us
                </a>
              </div>
            </div>
            <div className="bg-white px-6 py-10 sm:px-10 lg:py-14">
              <LeadForm type="QUOTE" variant="plain" whatsapp={site.whatsapp} source="home-page" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Counters */}
      <section aria-label="Macnet in numbers" className="pt-20 md:pt-24">
        <dl className="container-x grid grid-cols-3 gap-y-10 text-center">
          {[
            { v: brands.length, s: "", l: "Brands supplied" },
            { v: services.length, s: "", l: "Services offered" },
            { v: CLIENTS.length, s: "", l: "Clients served" },
          ].map((c, i) => (
            <Reveal key={c.l} delay={i * 0.1} className="flex flex-col-reverse">
              <dt className="mt-2 font-display text-[0.9375rem] font-medium text-heading">{c.l}</dt>
              <dd className="font-display text-[2.75rem] font-bold leading-none text-red sm:text-5xl">
                <Counter value={c.v} suffix={c.s} />
              </dd>
            </Reveal>
          ))}
        </dl>
      </section>

      {/* Brands */}
      <section aria-labelledby="brands-title" className="py-20 md:py-24">
        <div className="container-x">
          <Reveal>
            <h2 id="brands-title" className="text-center text-xl font-semibold sm:text-2xl">
              Trusted Brands We Supply & Support
            </h2>
          </Reveal>
          <ul className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5 max-sm:[&>li:last-child:nth-child(odd)]:col-span-2">
            {brands.map((b, i) => (
              <Reveal as="li" key={b.id} delay={i * 0.06}>
                {BRAND_LOGOS[b.slug] ? (
                  <span className="brand-logo flex h-24 items-center justify-center px-2">
                    <Image
                      src={BRAND_LOGOS[b.slug].src}
                      alt={b.name}
                      title={b.name}
                      width={BRAND_LOGOS[b.slug].width}
                      height={BRAND_LOGOS[b.slug].height}
                      sizes="200px"
                      className={`${BRAND_LOGOS[b.slug].h} w-auto max-w-full object-contain`}
                    />
                  </span>
                ) : (
                  <span className="flex h-24 items-center justify-center font-display text-2xl font-bold tracking-tight text-[#9a9da6] transition-colors duration-300 hover:text-red">
                    {b.name}
                  </span>
                )}
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Clients */}
      <section aria-labelledby="clients-list-title" className="border-t border-line bg-mist py-20 md:py-24">
        <div className="container-x">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">Our clients</p>
            <h2 id="clients-list-title" className="section-title mt-3">Businesses That Run on Our Networks</h2>
          </Reveal>
          <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6">
            {CLIENTS.map((c, i) => (
              <Reveal as="li" key={c.name} delay={i * 0.06}>
                <div className="flex h-28 items-center justify-center border border-line bg-white px-6 py-5">
                  <Image
                    src={c.logo}
                    alt={c.name}
                    title={c.name}
                    width={c.width}
                    height={c.height}
                    sizes="200px"
                    className="h-12 w-auto max-w-full object-contain"
                  />
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
