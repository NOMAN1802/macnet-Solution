import type { Metadata } from "next";
import { getOffices, getSiteSettings } from "@/lib/data";
import { telLink, whatsappLink } from "@/lib/site";
import { LeadForm } from "@/components/site/lead-form";
import { PageBanner } from "@/components/site/page-banner";
import { Reveal } from "@/components/ui/reveal";
import { MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Contact",
  description: "Visit or call Macnet Solutions in Dhaka: Haque Chamber, 89/2 Panthapath (Suite 3A).",
};

const circle = "grid h-11 w-11 place-items-center rounded-full bg-red text-white transition-colors duration-300 hover:bg-heading";

export default async function ContactPage() {
  const [site, offices] = await Promise.all([getSiteSettings(), getOffices()]);
  return (
    <>
      <PageBanner title="Contact Us" crumbs={[{ label: "Contact" }]} image="/images/banner-switch-cables.jpg" />

      <section className="py-16 md:py-24">
        <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-[60px]">
          <Reveal from="left" className="lg:col-span-6">
            <LeadForm type="CONTACT" whatsapp={site.whatsapp} source="contact-page" />
          </Reveal>

          <Reveal from="right" className="lg:col-span-6 lg:pt-6">
            <p className="eyebrow">Contact us</p>
            <h2 className="section-title mt-3">Let&apos;s Get in Touch</h2>
            <p className="mt-4">
              Talk to our sales team about equipment, a site survey or a support contract. Visit our office or reach us by phone, email or WhatsApp.
            </p>

            <ul className="mt-9 grid gap-8 sm:grid-cols-2">
              {offices.map((o) => (
                <li key={o.id} className="flex gap-4">
                  <PinIcon className="mt-0.5 h-7 w-7 shrink-0 text-red" />
                  <div>
                    <h3 className="text-lg font-semibold">{o.label}</h3>
                    <p className="mt-1 text-[0.9375rem]">{o.address}</p>
                    <a
                      href={o.mapUrl ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-more mt-2"
                    >
                      Open in Google Maps
                    </a>
                  </div>
                </li>
              ))}
              <li className="flex gap-4">
                <PhoneIcon className="mt-0.5 h-7 w-7 shrink-0 text-red" />
                <div>
                  <h3 className="text-lg font-semibold">Calling support</h3>
                  {site.phones.map((p) => (
                    <a key={p} href={telLink(p)} className="mt-1 block text-[0.9375rem] transition-colors hover:text-red">{p}</a>
                  ))}
                </div>
              </li>
              <li className="flex gap-4">
                <MailIcon className="mt-0.5 h-7 w-7 shrink-0 text-red" />
                <div>
                  <h3 className="text-lg font-semibold">Email</h3>
                  <a href={`mailto:${site.email}`} className="mt-1 block break-all text-[0.9375rem] transition-colors hover:text-red">{site.email}</a>
                  {site.altEmail ? (
                    <a href={`mailto:${site.altEmail}`} className="block break-all text-[0.9375rem] transition-colors hover:text-red">{site.altEmail}</a>
                  ) : null}
                </div>
              </li>
            </ul>

            <div className="mt-10 border-t border-line pt-8">
              <h3 className="text-lg font-semibold">Message us directly</h3>
              <div className="mt-4 flex gap-3">
                <a href={whatsappLink(site.whatsapp)} target="_blank" rel="noopener noreferrer" aria-label={`WhatsApp ${site.whatsapp}`} className={circle}>
                  <WhatsAppIcon className="h-5 w-5" />
                </a>
                <a href={telLink(site.phones[0])} aria-label={`Call ${site.phones[0]}`} className={circle}>
                  <PhoneIcon className="h-[18px] w-[18px]" />
                </a>
                <a href={`mailto:${site.email}`} aria-label={`Email ${site.email}`} className={circle}>
                  <MailIcon className="h-[18px] w-[18px]" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
