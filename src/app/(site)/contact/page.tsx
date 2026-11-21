import type { Metadata } from "next";
import { getOffices, getSiteSettings } from "@/lib/data";
import { telLink, whatsappLink } from "@/lib/site";
import { LeadForm } from "@/components/site/lead-form";
import { PortLabel } from "@/components/ui/port-label";
import { MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Contact",
  description: "Visit or call Macnet Solutions in Dhaka: head office in Mitford and branch office on Panthapoth.",
};

export default async function ContactPage() {
  const [site, offices] = await Promise.all([getSiteSettings(), getOffices()]);
  return (
    <>
      <section className="border-b border-rail-line">
        <div className="rack rails py-12 md:py-16">
          <PortLabel port="C-01">Contact</PortLabel>
          <h1 className="display mt-5 text-5xl text-ink md:text-7xl">Talk to our sales team.</h1>
          <div className="mt-8 grid gap-px border border-rail-line bg-rail-line sm:grid-cols-3">
            <a href={`mailto:${site.email}`} className="flex items-center gap-3 bg-paper p-5 hover:bg-white">
              <MailIcon className="h-5 w-5 text-ink" />
              <span>
                <span className="port block uppercase text-text-muted">Email</span>
                <span className="text-ink">{site.email}</span>
              </span>
            </a>
            <a href={telLink(site.phones[0])} className="flex items-center gap-3 bg-paper p-5 hover:bg-white">
              <PhoneIcon className="h-5 w-5 text-ink" />
              <span>
                <span className="port block uppercase text-text-muted">Phone</span>
                <span className="port text-[0.9375rem] text-ink">{site.phones.join(" · ")}</span>
              </span>
            </a>
            <a href={whatsappLink(site.whatsapp)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-paper p-5 hover:bg-white">
              <WhatsAppIcon className="h-5 w-5 text-ink" />
              <span>
                <span className="port block uppercase text-text-muted">WhatsApp</span>
                <span className="port text-[0.9375rem] text-ink">{site.whatsapp}</span>
              </span>
            </a>
          </div>
        </div>
      </section>

      <section className="rack grid gap-12 py-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="port uppercase text-text-muted">Offices</p>
          <ul className="mt-4 border-t border-ink">
            {offices.map((o, i) => (
              <li key={o.id} className="border-b border-rail-line py-6">
                <p className="port text-signal-ink">{`O-${String(i + 1).padStart(2, "0")}`}</p>
                <h2 className="heading mt-2 text-2xl text-ink">{o.label}</h2>
                <p className="mt-3 flex gap-2 text-text">
                  <PinIcon className="mt-1 h-4 w-4 shrink-0 text-text-muted" />
                  {o.address}
                </p>
                <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                  {o.phones.map((p) => (
                    <a key={p} href={telLink(p)} className="port text-text hover:text-ink">{p}</a>
                  ))}
                </p>
                <a
                  href={o.mapUrl ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="port mt-3 inline-block uppercase text-signal-ink underline underline-offset-4"
                >
                  Open in Google Maps
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-7">
          <p className="port mb-4 uppercase text-text-muted">Send a message</p>
          <LeadForm type="CONTACT" whatsapp={site.whatsapp} source="contact-page" />
        </div>
      </section>
    </>
  );
}
