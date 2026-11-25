import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/data";
import { telLink, whatsappLink } from "@/lib/site";
import { LeadForm } from "@/components/site/lead-form";
import { PageBanner } from "@/components/site/page-banner";
import { Reveal } from "@/components/ui/reveal";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Request a quote",
  description: "Send Macnet Solutions your equipment list or requirement and get a written quote with pricing and lead times.",
};

const STEPS = [
  { title: "We review your list", text: "We check stock and lead times with suppliers for every line." },
  { title: "An engineer calls if needed", text: "Anything unclear is confirmed by phone before we price it." },
  { title: "You get a written quote", text: "Usually within one working day, with installation options." },
];

const circle = "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-red text-white";

export default async function QuotePage() {
  const site = await getSiteSettings();
  return (
    <>
      <PageBanner title="Request a Quote" crumbs={[{ label: "Request a quote" }]} image="/images/banner-fibre-panel.jpg" />
      <section className="py-16 md:py-24">
        <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-[50px]">
          <Reveal from="left" className="lg:col-span-7">
            <LeadForm type="QUOTE" whatsapp={site.whatsapp} source="quote-page" />
          </Reveal>

          <Reveal from="right" className="lg:col-span-5 lg:pt-6">
            <p className="eyebrow">How it works</p>
            <h2 className="section-title mt-3">Tell Us What You Need</h2>
            <p className="mt-4">
              List models and quantities, or describe the site and the problem. We reply with a written quote, lead times and installation options.
            </p>
            <ol className="mt-9 space-y-7">
              {STEPS.map((s, i) => (
                <li key={s.title} className="flex gap-5">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-red font-display text-lg font-bold text-white">{i + 1}</span>
                  <span>
                    <span className="block font-display text-lg font-semibold text-heading">{s.title}</span>
                    <span className="mt-1 block text-[0.9375rem]">{s.text}</span>
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-10 border-t border-line pt-8">
              <h3 className="text-lg font-semibold">Prefer to talk?</h3>
              <ul className="mt-4 space-y-3">
                <li>
                  <a href={whatsappLink(site.whatsapp)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-heading transition-colors hover:text-red">
                    <span className={circle}><WhatsAppIcon className="h-5 w-5" /></span>
                    WhatsApp {site.whatsapp}
                  </a>
                </li>
                {site.phones.map((p) => (
                  <li key={p}>
                    <a href={telLink(p)} className="flex items-center gap-3 text-heading transition-colors hover:text-red">
                      <span className={circle}><PhoneIcon className="h-[18px] w-[18px]" /></span>
                      {p}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
