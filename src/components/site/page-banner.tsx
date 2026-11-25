import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "@/components/ui/icons";

type Crumb = { label: string; href?: string };

/** Inner-page banner: dark photo strip, centred title and breadcrumb (reference "inner banner"). */
export function PageBanner({ title, crumbs, image = "/images/banner-fibre-switch.jpg" }: { title: string; crumbs: Crumb[]; image?: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-navy pb-16 pt-[140px] text-center md:pb-24 md:pt-[190px]">
      <Image src={image} alt="" fill preload sizes="100vw" className="kenburns -z-20 object-cover" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[#11141b]/70" />
      <div className="container-x">
        <h1 className="mx-auto max-w-3xl text-[2rem] font-bold text-white sm:text-[2.75rem]">{title}</h1>
        <nav aria-label="Breadcrumb" className="mt-4">
          <ol className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[0.9375rem] text-white/90">
            <li>
              <Link href="/" className="transition-colors hover:text-red">Home</Link>
            </li>
            {crumbs.map((c) => (
              <li key={c.label} className="flex items-center gap-2">
                <ChevronRight className="h-3.5 w-3.5 text-red" />
                {c.href ? (
                  <Link href={c.href} className="transition-colors hover:text-red">{c.label}</Link>
                ) : (
                  <span aria-current="page">{c.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </section>
  );
}
