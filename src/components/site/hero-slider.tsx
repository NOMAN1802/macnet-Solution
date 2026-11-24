"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, PlayIcon } from "@/components/ui/icons";

type Slide = { image: string; title: [string, string]; text: string };

const DURATION = 7000;

/**
 * Full-screen photo hero from the reference: background photos crossfade with a slow zoom,
 * and the headline, copy and buttons slide in from the left each time the slide changes.
 */
export function HeroSlider({ brands }: { brands: string }) {
  const slides: Slide[] = [
    {
      image: "/images/hero-team.jpg",
      title: ["Networking Hardware", "Supplied & Installed"],
      text: `Switches, routers, Wi-Fi and firewalls from ${brands}, with the design, cabling and installation around them.`,
    },
    {
      image: "/images/hero-datacenter.jpg",
      title: ["Racks, Fibre & Cabling", "Built to Standard"],
      text: "Cat6/Cat6A and fibre backbones, racks and patching, labelled, tested and handed over with as-built documents.",
    },
    {
      image: "/images/hero-planning.jpg",
      title: ["One Partner From", "Survey to Support"],
      text: "Site surveys, network design, configuration and annual maintenance contracts from our Dhaka office on Panthapath.",
    },
  ];

  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduce || paused) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % slides.length), DURATION);
    return () => window.clearTimeout(id);
  }, [index, paused, reduce, slides.length]);

  const slide = slides[index];
  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, x: -80 },
          animate: { opacity: 1, x: 0 },
          transition: { duration: 0.9, delay, ease: [0.22, 0.61, 0.36, 1] as const },
        };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Highlights"
      className="relative isolate flex min-h-[640px] items-center overflow-hidden bg-navy pb-36 pt-[120px] sm:min-h-[720px] lg:min-h-[860px] lg:pb-44"
    >
      {/* Background photos */}
      <AnimatePresence initial={false}>
        <motion.div
          key={slide.image}
          className="absolute inset-0 -z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 1.2, ease: "easeInOut" }}
        >
          <Image src={slide.image} alt="" fill sizes="100vw" preload={index === 0} className={`object-cover ${reduce ? "" : "kenburns"}`} />
        </motion.div>
      </AnimatePresence>
      <div aria-hidden className="absolute inset-0 -z-10 bg-[#141821]/70" />

      <div className="container-x grid items-center gap-10 lg:grid-cols-12">
        <div key={index} className="lg:col-span-7">
          <motion.h1 {...enter(0.1)} className="text-[2.375rem] font-bold leading-[1.15] text-white sm:text-5xl lg:text-[3.75rem]">
            {slide.title[0]}
            <br />
            {slide.title[1]}
          </motion.h1>
          <motion.p {...enter(0.3)} className="mt-6 max-w-[34rem] text-base text-white/90 sm:text-lg">
            {slide.text}
          </motion.p>
          <motion.div {...enter(0.5)} className="mt-9 flex flex-wrap gap-3">
            <Link href="/quote" className="btn btn-red">
              Get a quote
            </Link>
            <Link href="/products" className="btn btn-ghost text-white">
              Browse products <ArrowRight />
            </Link>
          </motion.div>
        </div>

        <div className="hidden justify-center lg:col-span-5 lg:flex">
          <Link
            href="/#projects"
            className="pulse-ring relative isolate z-0 grid h-[88px] w-[88px] place-items-center rounded-full bg-white text-red transition-transform duration-300 hover:scale-105"
            aria-label="See recent projects"
          >
            <PlayIcon className="ml-1 h-7 w-7" />
          </Link>
        </div>
      </div>

      {/* Slide controls */}
      <div className="absolute bottom-[132px] right-4 flex items-center gap-2 sm:right-8 lg:bottom-auto lg:right-10 lg:top-1/2 lg:-translate-y-1/2 lg:flex-col">
        {slides.map((s, i) => (
          <button
            key={s.image}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Show slide ${i + 1}`}
            aria-current={i === index ? "true" : undefined}
            className={`h-3 w-3 rounded-full border-2 transition-colors duration-300 ${i === index ? "border-red bg-red" : "border-white bg-transparent hover:bg-white/60"}`}
          />
        ))}
        {!reduce ? (
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="ml-2 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-white/80 hover:text-white lg:ml-0 lg:mt-2"
          >
            {paused ? "Play" : "Pause"}
            <span className="sr-only"> slideshow</span>
          </button>
        ) : null}
      </div>
    </section>
  );
}
