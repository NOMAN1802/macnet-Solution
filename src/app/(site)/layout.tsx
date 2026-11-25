import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { WhatsAppFloat } from "@/components/site/whatsapp-float";
import { TouchHover } from "@/components/ui/touch-hover";
import { getSiteSettings } from "@/lib/data";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const site = await getSiteSettings();
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
        Skip to content
      </a>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <WhatsAppFloat number={site.whatsapp} />
      <TouchHover />
    </>
  );
}
