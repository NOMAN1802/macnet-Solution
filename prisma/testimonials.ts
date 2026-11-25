/**
 * Home-page reviews. These are SAMPLE reviews written for layout and tone: they are not
 * attributed to any real person or company and stay flagged isMock: true, which shows a
 * "Sample review" label on the site. Replace them with real, client-approved quotes
 * (see Doc/client-review-drafts.md) and set isMock: false for those.
 */
export type TestimonialSeed = { quote: string; name: string; role: string; company?: string; isMock: boolean };

export const TESTIMONIALS: TestimonialSeed[] = [
  {
    quote:
      "We run three shifts, so downtime was not an option. Macnet moved our whole factory floor onto the new switches over two Fridays and production never stopped.",
    name: "Garment manufacturer, Gazipur",
    role: "IT Manager",
    isMock: true,
  },
  {
    quote:
      "We sent a rough list on WhatsApp in the morning and had a written quote with lead times the next day. Everything arrived configured and labelled.",
    name: "Trading company, Motijheel",
    role: "Procurement Officer",
    isMock: true,
  },
  {
    quote:
      "Wi-Fi used to drop in every classroom on the top floor. After their survey and the new access points, coverage is even across the whole campus.",
    name: "Private school, Uttara",
    role: "Administration Head",
    isMock: true,
  },
  {
    quote:
      "Their engineer set up the UPS-backed rack and failover between our two ISPs. During load-shedding the office stays online now.",
    name: "Software firm, Banani",
    role: "Operations Lead",
    isMock: true,
  },
  {
    quote:
      "The fibre run between our warehouse and the export office was done neatly, tested, and handed over with drawings. Very professional team.",
    name: "Export house, Chattogram",
    role: "Admin Manager",
    isMock: true,
  },
  {
    quote:
      "We have been on their AMC for over a year. When a switch failed they swapped it the same day, before most of our staff noticed.",
    name: "Diagnostic centre, Dhanmondi",
    role: "IT Executive",
    isMock: true,
  },
];
