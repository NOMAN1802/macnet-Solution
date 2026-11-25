import type { Metadata } from "next";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { WhatsAppFloat } from "@/components/site/whatsapp-float";
import { getSiteSettings } from "@/lib/data";
import SiteNotFound from "./(site)/not-found";

export const metadata: Metadata = { title: "Page not found", robots: { index: false } };

/**
 * 404 for any unknown URL. Unmatched URLs never reach the (site) layout, so this wraps the
 * site's not-found content in the same header, footer and WhatsApp button.
 */
export default async function NotFound() {
  const site = await getSiteSettings();
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        <SiteNotFound />
      </main>
      <Footer />
      <WhatsAppFloat number={site.whatsapp} />
    </>
  );
}
