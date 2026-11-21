/** Fallback contact details. The CMS (SiteSettings / Office) overrides these at runtime. */
export const SITE = {
  name: "Macnet Solutions",
  email: "sales@macnetsolution.com.bd",
  altEmail: "arif@macnetsolutions.com.bd",
  phones: ["+880 1750148979", "+880 1841778669"],
  whatsapp: "+880 1750148979",
} as const;

export function whatsappLink(number: string, text?: string) {
  const digits = number.replace(/[^\d]/g, "");
  const q = text ? `?text=${encodeURIComponent(text)}` : "";
  return `https://wa.me/${digits}${q}`;
}

export function telLink(number: string) {
  return `tel:${number.replace(/[^\d+]/g, "")}`;
}
