/** Inline icons (currentColor). Line icons use a 1.5 stroke like the reference template's red outline icons. */
type P = { className?: string };

const line = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const ArrowRight = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 16 16" {...line} strokeWidth={1.6} className={className} aria-hidden>
    <path d="M2 8h11M9 4l4 4-4 4" />
  </svg>
);

export const ChevronRight = ({ className = "h-3.5 w-3.5" }: P) => (
  <svg viewBox="0 0 16 16" {...line} strokeWidth={2} className={className} aria-hidden>
    <path d="m6 3 5 5-5 5" />
  </svg>
);

export const CheckIcon = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 16 16" {...line} strokeWidth={2.2} className={className} aria-hidden>
    <path d="m2.5 8.5 3.5 3.5 7.5-8" />
  </svg>
);

export const PlayIcon = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M8 5.5v13a.8.8 0 0 0 1.2.7l10.4-6.5a.8.8 0 0 0 0-1.4L9.2 4.8A.8.8 0 0 0 8 5.5Z" />
  </svg>
);

export const QuoteIcon = ({ className = "h-8 w-8" }: P) => (
  <svg viewBox="0 0 32 32" fill="currentColor" className={className} aria-hidden>
    <path d="M13 8C7.5 9.3 4 13.6 4 19.3V24h8.5v-8.4H8.3c.3-3 2.2-5.1 5.2-5.9L13 8Zm15 0c-5.5 1.3-9 5.6-9 11.3V24h8.5v-8.4h-4.2c.3-3 2.2-5.1 5.2-5.9L28 8Z" />
  </svg>
);

export const WhatsAppIcon = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42h-.48a.92.92 0 0 0-.66.31c-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
  </svg>
);

export const PhoneIcon = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" {...line} className={className} aria-hidden>
    <path d="M5 3h3.5l1.8 4.6-2.3 1.5a11 11 0 0 0 6 6l1.5-2.3L20 14.5V18a2 2 0 0 1-2.1 2A16 16 0 0 1 3 5.1 2 2 0 0 1 5 3Z" />
  </svg>
);

export const MailIcon = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" {...line} className={className} aria-hidden>
    <rect x="2.5" y="5" width="19" height="14" rx="1" />
    <path d="m3 6 9 7 9-7" />
  </svg>
);

export const PinIcon = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" {...line} className={className} aria-hidden>
    <path d="M12 21.5s7-6.2 7-11.8A7 7 0 0 0 5 9.7c0 5.6 7 11.8 7 11.8Z" />
    <circle cx="12" cy="9.5" r="2.6" />
  </svg>
);

/* ---- Feature / service line icons ---- */

export const SwitchIcon = ({ className = "h-11 w-11" }: P) => (
  <svg viewBox="0 0 48 48" {...line} className={className} aria-hidden>
    <rect x="4" y="16" width="40" height="14" rx="1.5" />
    <path d="M9 21h3v4H9zM15 21h3v4h-3zM21 21h3v4h-3zM27 21h3v4h-3z" />
    <circle cx="37" cy="23" r="1.4" />
    <path d="M9 30v4M39 30v4M12 12h24" />
  </svg>
);

export const RouterIcon = ({ className = "h-11 w-11" }: P) => (
  <svg viewBox="0 0 48 48" {...line} className={className} aria-hidden>
    <rect x="5" y="27" width="38" height="11" rx="2" />
    <path d="M12 27V17M36 27V17M11 32.5h2M17 32.5h2M23 32.5h2" />
    <path d="M18 13a8 8 0 0 1 12 0M15 9.5a13 13 0 0 1 18 0" />
    <circle cx="37" cy="32.5" r="1.2" />
  </svg>
);

export const RackIcon = ({ className = "h-11 w-11" }: P) => (
  <svg viewBox="0 0 48 48" {...line} className={className} aria-hidden>
    <rect x="10" y="4" width="28" height="40" rx="1.5" />
    <path d="M14 11h20v7H14zM14 22h20v7H14zM14 33h20v6H14z" />
    <circle cx="30" cy="14.5" r="1" />
    <circle cx="30" cy="25.5" r="1" />
  </svg>
);

export const BlueprintIcon = ({ className = "h-11 w-11" }: P) => (
  <svg viewBox="0 0 48 48" {...line} className={className} aria-hidden>
    <rect x="6" y="8" width="36" height="30" rx="1.5" />
    <path d="M6 16h36M14 24h8v8h-8zM28 24h8M28 29h6M32 38v4M16 38v4" />
  </svg>
);

export const CableIcon = ({ className = "h-11 w-11" }: P) => (
  <svg viewBox="0 0 48 48" {...line} className={className} aria-hidden>
    <path d="M16 4v8M24 4v8M12 12h16v8a8 8 0 0 1-16 0v-8ZM20 28v6a8 8 0 0 0 8 8h4a8 8 0 0 0 8-8V20" />
    <rect x="34" y="12" width="12" height="8" rx="1" />
  </svg>
);

export const ToolsIcon = ({ className = "h-11 w-11" }: P) => (
  <svg viewBox="0 0 48 48" {...line} className={className} aria-hidden>
    <path d="M30 6a9 9 0 0 0-8.5 12L6 33.5a3.5 3.5 0 0 0 5 5L26.5 23A9 9 0 0 0 38 13.5l-5 5-5-1-1-5 5-5A9 9 0 0 0 30 6Z" />
  </svg>
);

export const HeadsetIcon = ({ className = "h-11 w-11" }: P) => (
  <svg viewBox="0 0 48 48" {...line} className={className} aria-hidden>
    <path d="M9 26v-4a15 15 0 0 1 30 0v4" />
    <rect x="6" y="25" width="7" height="12" rx="2" />
    <rect x="35" y="25" width="7" height="12" rx="2" />
    <path d="M38.5 37c0 4-4 6-10 6h-3" />
    <path d="m19 22 3.5 3.5L29 19" />
  </svg>
);

const SERVICE_ICONS = [BlueprintIcon, CableIcon, ToolsIcon, HeadsetIcon];

/** Icon for a service by its position (design, cabling, install, support). */
export function ServiceIcon({ index, className }: { index: number; className?: string }) {
  const Icon = SERVICE_ICONS[index % SERVICE_ICONS.length];
  return <Icon className={className} />;
}
