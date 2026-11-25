"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const SELECTOR = ".fill-card, .hover-zoom";

/**
 * Touch screens have no hover, so the card hover animations would never play on phones.
 * On devices without a hovering pointer, this plays the same animation (the `.is-hover` class)
 * while a card passes through the middle band of the screen as the visitor scrolls.
 * A tap also works, because the CSS treats :focus-within the same as hover.
 */
export function TouchHover() {
  const pathname = usePathname();

  useEffect(() => {
    if (!window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.target.classList.toggle("is-hover", e.isIntersecting);
      },
      // a band roughly 30% of the screen high, centred vertically
      { rootMargin: "-35% 0px -35% 0px" },
    );
    const cards = document.querySelectorAll(SELECTOR);
    cards.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      cards.forEach((el) => el.classList.remove("is-hover"));
    };
  }, [pathname]);

  return null;
}
