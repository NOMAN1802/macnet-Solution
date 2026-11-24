"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { QuoteIcon } from "@/components/ui/icons";

type Item = { id: string; quote: string; name: string; role: string | null; company: string | null };

/** Rotating client quotes on the red panel (reference "What client say about us"). */
export function TestimonialSlider({ items }: { items: Item[] }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [hold, setHold] = useState(false);

  useEffect(() => {
    if (reduce || hold || items.length < 2) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % items.length), 6000);
    return () => window.clearTimeout(id);
  }, [index, hold, reduce, items.length]);

  if (!items.length) return null;
  const t = items[index];
  const initials = t.name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return (
    <div onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)} onFocus={() => setHold(true)} onBlur={() => setHold(false)}>
      <span className="mx-auto grid h-[72px] w-[72px] place-items-center rounded-full bg-white text-red">
        <QuoteIcon className="h-8 w-8" />
      </span>
      <div className="relative mt-8 min-h-[250px] sm:min-h-[210px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.figure
            key={t.id}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -24 }}
            transition={{ duration: 0.55, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <blockquote className="mx-auto max-w-xl text-lg italic leading-relaxed text-white sm:text-xl">“{t.quote}”</blockquote>
            <figcaption className="mt-7 flex flex-col items-center">
              <span aria-hidden className="grid h-14 w-14 place-items-center rounded-full border-[3px] border-white bg-white/15 font-display font-semibold text-white">
                {initials}
              </span>
              <span className="mt-3 font-display text-base font-semibold text-white">{t.name}</span>
              <span className="text-sm text-white/85">{[t.role, t.company].filter(Boolean).join(", ")}</span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>
      {items.length > 1 ? (
        <div className="mt-6 flex justify-center gap-2.5">
          {items.map((it, i) => (
            <button
              key={it.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show quote ${i + 1} of ${items.length}`}
              aria-current={i === index ? "true" : undefined}
              className={`h-2.5 rounded-full transition-all duration-300 ${i === index ? "w-7 bg-white" : "w-2.5 bg-white/45 hover:bg-white/75"}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
