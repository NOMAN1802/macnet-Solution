/** Fallback contact details. The CMS (SiteSettings / Office) overrides these at runtime. */
export const SITE = {
  name: "Macnet Solutions",
  email: "info@macnetsolutions.com.bd",
  altEmail: undefined as string | undefined,
  phones: ["+880 1750148979"],
  whatsapp: "+880 1750148979",
  address: "Haque Chamber, 89/2 Panthapath (Suite 3A), Dhaka",
} as const;

/** Organisations Macnet has supplied or installed for. */
export const CLIENTS = ["Pacific Jeans", "1000Fix", "Global Brand Pvt Ltd", "Omega Exim", "Star Tech"] as const;

export function whatsappLink(number: string, text?: string) {
  const digits = number.replace(/[^\d]/g, "");
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${digits}${q}`;
}

export function telLink(number: string) {
  return `tel:${number.replace(/[^\d+]/g, "")}`;
}
