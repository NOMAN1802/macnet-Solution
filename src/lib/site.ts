/** Fallback contact details. The CMS (SiteSettings / Office) overrides these at runtime. */
export const SITE = {
  name: "Macnet Solutions",
  email: "info@macnetsolutions.com.bd",
  altEmail: undefined as string | undefined,
  phones: ["+880 1750148979"],
  whatsapp: "+880 1750148979",
  address: "Haque Chamber, 89/2 Panthapath (Suite 3A), Dhaka",
} as const;

/**
 * Video shown when a visitor presses a play button (hero, services). Paste a YouTube link or ID
 * into `youtube` to play that; while it is empty the site's own network video plays instead.
 */
export const INTRO_VIDEO = {
  youtube: "",
  mp4: "/video/hero-network.mp4",
  title: "Macnet Solutions: networking hardware, supplied and installed",
};

/** Accepts a YouTube ID or any youtube.com / youtu.be URL and returns the 11-character ID. */
export function youtubeId(input: string): string | null {
  const s = input.trim();
  if (/^[\w-]{11}$/.test(s)) return s;
  const m = s.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/|\/live\/)([\w-]{11})/);
  return m ? m[1] : null;
}

/**
 * Logos for the brands Macnet supplies, keyed by Brand.slug. Files in public/brands/ are
 * transparent PNGs trimmed to the logo, 200px tall. `h` is the on-screen height (Tailwind
 * class), tuned per logo so wide wordmarks and the stacked Ubiquiti mark look balanced.
 */
export const BRAND_LOGOS: Record<string, { src: string; width: number; height: number; h: string }> = {
  ubiquiti: { src: "/brands/ubiquiti.png", width: 166, height: 200, h: "h-16" },
  cisco: { src: "/brands/cisco.png", width: 340, height: 200, h: "h-12" },
  tenda: { src: "/brands/tenda.png", width: 870, height: 200, h: "h-8" },
  rosenberger: { src: "/brands/rosenberger.png", width: 1254, height: 200, h: "h-9" },
  "tp-link": { src: "/brands/tp-link.png", width: 1120, height: 200, h: "h-7" },
};

/** Organisations Macnet has supplied or installed for. Logos live in public/clients/. */
export const CLIENTS = [
  { name: "Pacific Jeans", logo: "/clients/pacific-jeans.png", width: 434, height: 151 },
  { name: "1000Fix", logo: "/clients/1000fix.png", width: 800, height: 363 },
  { name: "Global Brand Pvt Ltd", logo: "/clients/global-brand.svg", width: 600, height: 200 },
  { name: "Omega Exim", logo: "/clients/omega-exim.png", width: 142, height: 70 },
  { name: "Star Tech", logo: "/clients/star-tech.png", width: 144, height: 64 },
] as const;

export function whatsappLink(number: string, text?: string) {
  const digits = number.replace(/[^\d]/g, "");
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${digits}${q}`;
}

export function telLink(number: string) {
  return `tel:${number.replace(/[^\d+]/g, "")}`;
}
