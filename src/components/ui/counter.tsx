"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

/** Counts up from 0 to `value` once it scrolls into view (reference "number counters"). */
export function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || reduce) return;
    const controls = animate(0, value, {
      duration: 2,
      ease: [0.22, 0.61, 0.36, 1],
      onUpdate: (v) => {
        el.textContent = `${Math.round(v).toLocaleString()}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduce, value, suffix]);

  return <span ref={ref}>{`${value.toLocaleString()}${suffix}`}</span>;
}
