"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, type PanInfo } from "motion/react";
import { QuoteIcon } from "@/components/ui/icons";

type Item = { id: string; quote: string; name: string; role: string | null; company: string | null; isMock: boolean };

const AUTOPLAY_MS = 5000;
/** Slide timing measured from the reference video: ~1s, fast start and a long soft stop. */
const SLIDE = { duration: 1, ease: [0.16, 1, 0.3, 1] as const };

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * Client quotes on the accent panel. The whole track slides horizontally, the outgoing quote
 * leaving to the left while the next one comes in from the right (reference testimonial carousel).
 * Autoplays, pauses while hovered or focused, and can be swiped on touch screens.
 */
export function TestimonialSlider({ items }: { items: Item[] }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [hold, setHold] = useState(false);
  const count = items.length;

  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count]);

  useEffect(() => {
    if (reduce || hold || count < 2) return;
    const id = window.setTimeout(() => go(index + 1), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [index, hold, reduce, count, go]);

  const swipe = (dx: number, dy: number) => {
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
    go(index + (dx < 0 ? 1 : -1));
  };

  // Mouse / pen drag. Touch is handled by the touch events below, because a phone browser may
  // cancel pointer events once it thinks the finger is scrolling the page.
  const onPanEnd = (e: PointerEvent, info: PanInfo) => {
    if (e.pointerType !== "touch") swipe(info.offset.x, info.offset.y);
  };
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const s = touchStart.current;
    const t = e.changedTouches[0];
    touchStart.current = null;
    if (s && t) swipe(t.clientX - s.x, t.clientY - s.y);
  };

  if (!count) return null;

  return (
    <div
      aria-roledescription="carousel"
      aria-label="Client reviews"
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={() => setHold(false)}
    >
      <span className="mx-auto grid h-[72px] w-[72px] place-items-center rounded-full bg-white text-red">
        <QuoteIcon className="h-8 w-8" />
      </span>

      <motion.div className="mt-8 cursor-grab touch-pan-y overflow-hidden active:cursor-grabbing"
        onPanEnd={onPanEnd}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <motion.div
          className="flex touch-pan-y"
          initial={false}
          animate={{ x: `${-index * 100}%` }}
          transition={reduce ? { duration: 0 } : SLIDE}
        >
          {items.map((t, i) => (
            <figure
              key={t.id}
              className="w-full shrink-0 touch-pan-y select-none px-1"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${count}`}
              aria-hidden={i !== index}
              inert={i !== index}
            >
              <blockquote className="mx-auto max-w-xl text-lg italic leading-relaxed text-white sm:text-xl">“{t.quote}”</blockquote>
              <figcaption className="mt-7 flex flex-col items-center">
                <span aria-hidden className="grid h-14 w-14 place-items-center rounded-full border-[3px] border-white bg-white/15 font-display font-semibold text-white">
                  {initials(t.name)}
                </span>
                <span className="mt-3 font-display text-base font-semibold text-white">{t.name}</span>
                <span className="text-sm text-white/85">{[t.role, t.company].filter(Boolean).join(", ")}</span>
                {t.isMock ? (
                  <span className="mt-3 rounded-full border border-white/40 px-3 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-white/75">
                    Sample review
                  </span>
                ) : null}
              </figcaption>
            </figure>
          ))}
        </motion.div>
      </motion.div>

      {count > 1 ? (
        <div className="mt-8 flex justify-center gap-2.5">
          {items.map((it, i) => (
            <button
              key={it.id}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show review ${i + 1} of ${count}`}
              aria-current={i === index ? "true" : undefined}
              className={`h-2.5 rounded-full transition-all duration-300 ${i === index ? "w-7 bg-white" : "w-2.5 bg-white/45 hover:bg-white/75"}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
