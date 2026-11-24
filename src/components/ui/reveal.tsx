"use client";

import { motion, useReducedMotion } from "motion/react";

const OFFSET = {
  up: { x: 0, y: 60 },
  down: { x: 0, y: -60 },
  left: { x: -70, y: 0 },
  right: { x: 70, y: 0 },
  none: { x: 0, y: 0 },
} as const;

/**
 * Scroll-triggered entrance used across the site, matching the reference template's
 * fadeInUp / fadeInLeft / fadeInRight entrances. Opacity and transform only.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
  from = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section";
  from?: keyof typeof OFFSET;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, ...OFFSET[from] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </Comp>
  );
}
