"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight } from "@/components/ui/icons";
import { PlayButton } from "@/components/site/video-modal";

type Slide = { title: [string, string]; text: string };

const DURATION = 7000;

const VIDEO = { desktop: "/video/hero-network.mp4", mobile: "/video/hero-network-mobile.mp4", poster: "/images/hero-network-poster.jpg" };

/**
 * Full-screen hero over a looping video of network equipment (switches, patch cables, racks). The headline, copy and buttons slide in
 * from the left each time the slide changes (reference template). The Pause control stops both
 * the slides and the video; with reduced motion only the still poster frame is shown.
 */
export function HeroSlider({ brands }: { brands: string }) {
  const slides: Slide[] = [
    {
      title: ["Networking Hardware", "Supplied & Installed"],
      text: `Switches, routers, Wi-Fi and firewalls from ${brands}, with the design, cabling and installation around them.`,
    },
    {
      title: ["Racks, Fibre & Cabling", "Built to Standard"],
      text: "Cat6/Cat6A and fibre backbones, racks and patching, labelled, tested and handed over with as-built documents.",
    },
    {
      title: ["One Partner From", "Survey to Support"],
      text: "Site surveys, network design, configuration and annual maintenance contracts from our Dhaka office on Panthapath.",
    },
  ];

  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const video = useRef<HTMLVideoElement>(null);

  // Start the background video reliably. Browsers only autoplay muted video, and React sets
  // `muted` as a DOM property rather than relying on the HTML attribute, so set it explicitly,
  // then (re)try playing once data is ready and whenever the tab becomes visible again.
  // If the browser still refuses (e.g. iOS Low Power Mode) the poster frame stays visible.
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;
    if (paused) {
      v.pause();
      return;
    }
    const tryPlay = () => {
      if (v.paused && document.visibilityState === "visible") v.play().catch(() => {});
    };
    tryPlay();
    v.addEventListener("canplay", tryPlay);
    document.addEventListener("visibilitychange", tryPlay);
    return () => {
      v.removeEventListener("canplay", tryPlay);
      document.removeEventListener("visibilitychange", tryPlay);
    };
  }, [paused]);

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
      {/* Background: looping network-equipment video (poster frame shown while it loads) */}
      {reduce ? (
        <Image src={VIDEO.poster} alt="" fill sizes="100vw" preload className="-z-20 object-cover" />
      ) : (
        <video
          ref={video}
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          poster={VIDEO.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
        >
          <source src={VIDEO.mobile} type="video/mp4" media="(max-width: 767px)" />
          <source src={VIDEO.desktop} type="video/mp4" />
        </video>
      )}
      <div aria-hidden className="absolute inset-0 -z-10 bg-[#141821]/60" />

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
            <Link href="/#services" className="btn btn-ghost text-white">
              Our services <ArrowRight />
            </Link>
          </motion.div>
        </div>

        <div className="hidden justify-center lg:col-span-5 lg:flex">
          <PlayButton label="Play our video" />
        </div>
      </div>

      {/* Slide controls */}
      <div className="absolute bottom-[132px] right-4 flex items-center gap-2 sm:right-8 lg:bottom-auto lg:right-10 lg:top-1/2 lg:-translate-y-1/2 lg:flex-col">
        {slides.map((s, i) => (
          <button
            key={s.title.join(" ")}
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
            <span className="sr-only"> slideshow and background video</span>
          </button>
        ) : null}
      </div>
    </section>
  );
}
