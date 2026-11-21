"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Wordmark } from "@/components/ui/wordmark";

const NAV = [
  { href: "/products", label: "Products" },
  { href: "/#services", label: "Services" },
  { href: "/#projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  // Menu stays open only for the path it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;

  return (
    <header className="sticky top-0 z-30 border-b border-rail-line bg-paper/95 backdrop-blur-[2px]">
      <div className="rack flex h-16 items-center justify-between gap-6">
        <Wordmark />
        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => {
            const active = item.href === "/products" ? pathname.startsWith("/products") : pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-[0.9375rem] font-medium transition-colors hover:text-ink ${active ? "text-ink" : "text-text-muted"}`}
              >
                {item.label}
                {active ? <span aria-hidden className="absolute -bottom-[23px] left-0 right-0 h-[2px] bg-signal" /> : null}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/quote" className="btn btn-primary hidden sm:inline-flex">
            Request a quote
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center border border-rail-line md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpenOn(open ? null : pathname)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span aria-hidden className="flex w-5 flex-col gap-[5px]">
              <span className={`h-[2px] bg-ink transition-transform ${open ? "translate-y-[7px] rotate-45" : ""}`} />
              <span className={`h-[2px] bg-ink transition-opacity ${open ? "opacity-0" : ""}`} />
              <span className={`h-[2px] bg-ink transition-transform ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>
      <div id="mobile-nav" hidden={!open} className="border-t border-rail-line bg-paper md:hidden">
        <nav aria-label="Mobile" className="rack flex flex-col py-2">
          {NAV.map((item, i) => (
            <Link key={item.href} href={item.href} className="flex items-center gap-3 border-b border-rail-line py-3.5 text-lg text-ink last:border-0">
              <span className="port text-rail">{String(i + 1).padStart(2, "0")}</span>
              {item.label}
            </Link>
          ))}
          <Link href="/quote" className="btn btn-primary my-3 justify-center">
            Request a quote
          </Link>
        </nav>
      </div>
    </header>
  );
}
