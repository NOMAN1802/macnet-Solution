import Link from "next/link";
import { getCategories, getOffices, getSiteSettings } from "@/lib/data";
import { telLink, whatsappLink } from "@/lib/site";
import { Wordmark } from "@/components/ui/wordmark";
import { ChevronRight, MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/ui/icons";

const QUICK = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/#services", label: "Services" },
  { href: "/#projects", label: "Projects" },
  { href: "/quote", label: "Request a quote" },
  { href: "/contact", label: "Contact" },
];

const circle =
  "grid h-11 w-11 place-items-center rounded-full bg-red text-white transition-colors duration-300 hover:bg-white hover:text-red";

export async function Footer() {
  "use cache";
  const [site, offices, categories] = await Promise.all([getSiteSettings(), getOffices(), getCategories()]);
  const head = offices[0];
  return (
    <footer className="mt-auto bg-navy text-white/75">
      <div className="container-x grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-4">
          <Wordmark tone="paper" />
          <p className="mt-6 max-w-xs text-[0.9375rem]">
            Networking hardware from five brands, plus the design, cabling, installation and support around it.
          </p>
          <ul className="mt-6 space-y-3 text-[0.9375rem] text-white">
            {head ? (
              <li className="flex gap-3">
                <PinIcon className="mt-1 h-4 w-4 shrink-0 text-red" />
                {head.address}
              </li>
            ) : null}
            <li className="flex gap-3">
              <MailIcon className="mt-1 h-4 w-4 shrink-0 text-red" />
              <a href={`mailto:${site.email}`} className="break-all transition-colors hover:text-red">{site.email}</a>
            </li>
            <li className="flex gap-3">
              <PhoneIcon className="mt-1 h-4 w-4 shrink-0 text-red" />
              <span className="flex flex-col">
                {site.phones.map((p) => (
                  <a key={p} href={telLink(p)} className="transition-colors hover:text-red">{p}</a>
                ))}
              </span>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h2 className="text-lg font-semibold text-white">Products</h2>
          <ul className="mt-6 space-y-3 text-[0.9375rem]">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/products?category=${c.slug}`} className="group inline-flex items-center gap-3 text-white transition-colors hover:text-red">
                  <ChevronRight className="h-3 w-3 text-red transition-transform group-hover:translate-x-1" />
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-white">Quick links</h2>
          <ul className="mt-6 space-y-3 text-[0.9375rem]">
            {QUICK.map((q) => (
              <li key={q.href}>
                <Link href={q.href} className="group inline-flex items-center gap-3 text-white transition-colors hover:text-red">
                  <ChevronRight className="h-3 w-3 text-red transition-transform group-hover:translate-x-1" />
                  {q.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h2 className="text-lg font-semibold text-white">Office</h2>
          <ul className="mt-6 space-y-5 text-[0.9375rem]">
            {offices.map((o) => (
              <li key={o.id}>
                <p className="font-medium text-white">{o.label}</p>
                <p className="mt-1">{o.address}</p>
              </li>
            ))}
          </ul>
          <div className="mt-7 flex gap-3">
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
      </div>
      <div className="container-x">
        <div className="flex flex-col gap-2 border-t border-white/10 py-6 text-sm sm:flex-row sm:justify-between">
          <span>Networking hardware, supplied and installed in Dhaka. Prices on request.</span>
          <span>© {new Date().getFullYear()} Macnet Solutions. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
