"use client";

import dynamic from "next/dynamic";
import { useReducedMotion } from "motion/react";

const RackScene = dynamic(() => import("./rack-scene"), {
  ssr: false,
  loading: () => <div className="h-full w-full" aria-hidden />,
});

export function HeroVisual() {
  const reduce = useReducedMotion();
  return (
    <div className="relative h-[320px] w-full sm:h-[420px] lg:h-[520px]">
      <RackScene animate={!reduce} />
    </div>
  );
}
