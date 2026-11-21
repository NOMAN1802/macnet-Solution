import Link from "next/link";
import { getCategories, getOffices, getSiteSettings } from "@/lib/data";
import { telLink, whatsappLink } from "@/lib/site";
import { Wordmark } from "@/components/ui/wordmark";

export async function Footer() {
  "use cache";
  const [site, offices, categories] = await Promise.all([getSiteSettings(), getOffices(), getCategories()]);
  return (
    <footer className="mt-auto bg-rack text-paper">
      <div className="rack rails-dark grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <Wordmark tone="paper" />
          <p className="mt-5 max-w-xs text-sm text-rail">
            Networking hardware from six brands, plus the design, cabling, installation and support around it. Based in Dhaka.
          </p>
          <div className="mt-6 flex flex-col gap-2 text-sm">
            <a href={`mailto:${site.email}`} className="hover:text-signal">{site.email}</a>
            {site.phones.map((p) => (
              <a key={p} href={telLink(p)} className="port text-[0.8125rem] hover:text-signal">{p}</a>
            ))}
            <a href={whatsappLink(site.whatsapp)} target="_blank" rel="noopener noreferrer" className="hover:text-signal">
              WhatsApp {site.whatsapp}
            </a>
          </div>
        </div>
        <div className="md:col-span-3">
          <p className="port uppercase text-rail">Products</p>
          <ul className="mt-4 space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.id}>
                <Link href={`/products?category=${c.slug}`} className="hover:text-signal">{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-5">
          <p className="port uppercase text-rail">Offices</p>
          <ul className="mt-4 grid gap-6 sm:grid-cols-2">
            {offices.map((o) => (
              <li key={o.id} className="text-sm">
                <p className="font-semibold">{o.label}</p>
                <p className="mt-1 text-rail">{o.address}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-rail-line-dark">
        <div className="rack port flex flex-col gap-2 py-5 uppercase text-rail sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Macnet Solutions</span>
          <span>Prices on request · No online checkout</span>
        </div>
      </div>
    </footer>
  );
}
