"use client";

import { useEffect, useRef, useState } from "react";
import { INTRO_VIDEO, youtubeId } from "@/lib/site";
import { PlayIcon } from "@/components/ui/icons";

/**
 * Round pulsing play button that opens the intro video in a lightbox (reference template's
 * Elementor video lightbox): the page dims, a 16:9 player zooms in and starts playing.
 * Closes on the × button, Esc, or a click outside the player; closing unmounts the player,
 * which stops playback. Uses the native <dialog> for focus trapping and the top layer.
 */
export function PlayButton({
  className = "h-[88px] w-[88px]",
  iconClassName = "ml-1 h-7 w-7",
  label = "Play video",
}: {
  className?: string;
  iconClassName?: string;
  label?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const yt = INTRO_VIDEO.youtube ? youtubeId(INTRO_VIDEO.youtube) : null;

  // keep the page behind the lightbox from scrolling
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
    };
  }, [open]);

  const show = () => {
    setOpen(true);
    dialog.current?.showModal();
  };
  const close = () => dialog.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={show}
        aria-haspopup="dialog"
        aria-label={label}
        className={`pulse-ring relative isolate z-0 grid cursor-pointer place-items-center rounded-full bg-white text-red transition-transform duration-300 hover:scale-105 ${className}`}
      >
        <PlayIcon className={iconClassName} />
      </button>

      <dialog
        ref={dialog}
        aria-label={INTRO_VIDEO.title}
        onClose={() => setOpen(false)}
        // a click on the dimmed area (the dialog itself, not the player) closes it
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        className="video-modal m-0 h-dvh max-h-none w-full max-w-none items-center justify-center bg-transparent p-4 open:flex sm:p-10"
      >
        {open ? (
          <div className="video-modal-panel relative w-full max-w-[1100px]">
            <button
              type="button"
              onClick={close}
              aria-label="Close video"
              className="absolute -top-12 right-0 grid h-11 w-11 place-items-center text-white/85 transition-colors hover:text-white"
            >
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M5 5l14 14M19 5 5 19" />
              </svg>
            </button>
            <div className="aspect-video w-full overflow-hidden bg-black shadow-[0_20px_60px_rgb(0_0_0/0.5)]">
              {yt ? (
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                  title={INTRO_VIDEO.title}
                  allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                  allowFullScreen
                />
              ) : (
                <video className="h-full w-full" src={INTRO_VIDEO.mp4} controls autoPlay playsInline aria-label={INTRO_VIDEO.title} />
              )}
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
