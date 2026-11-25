"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Wordmark } from "@/components/ui/wordmark";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/#services", label: "Services" },
  { href: "/#projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href.startsWith("/#")) return false;
  return pathname.startsWith(href);
}

/** Transparent header laid over the hero / page banner, as in the reference template. */
export function Header() {
  const pathname = usePathname();
  // Menu stays open only for the path it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenOn(null);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="absolute inset-x-0 top-0 z-30 border-b border-white/15">
      <div className="container-x flex h-[78px] items-center justify-between gap-6 lg:h-[92px]">
        <Wordmark tone="paper" />
        <nav aria-label="Main" className="hidden items-center gap-9 lg:flex">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`font-display text-[0.8125rem] font-semibold uppercase tracking-[0.08em] transition-colors duration-300 hover:text-red ${active ? "text-red" : "text-white"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/quote" className="btn btn-red hidden sm:inline-flex">
            Get a quote
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center bg-red text-white lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpenOn(open ? null : pathname)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span aria-hidden className="flex w-5 flex-col gap-[5px]">
              <span className={`h-[2px] bg-current transition-transform duration-300 ${open ? "translate-y-[7px] rotate-45" : ""}`} />
              <span className={`h-[2px] bg-current transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
              <span className={`h-[2px] bg-current transition-transform duration-300 ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            key="mobile-nav"
            className="fixed inset-x-0 bottom-0 top-[78px] z-30 overflow-y-auto bg-navy lg:hidden"
            initial={reduce ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <nav aria-label="Mobile" className="container-x flex flex-col py-4">
              {NAV.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={reduce ? false : { opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i + 0.1, duration: 0.35 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpenOn(null)}
                    className={`flex items-center justify-between border-b border-white/10 py-4 font-display text-lg font-semibold ${isActive(pathname, item.href) ? "text-red" : "text-white"}`}
                  >
                    {item.label}
                    <span aria-hidden className="text-red">›</span>
                  </Link>
                </motion.div>
              ))}
              <Link href="/quote" onClick={() => setOpenOn(null)} className="btn btn-red mt-6">
                Get a quote
              </Link>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
