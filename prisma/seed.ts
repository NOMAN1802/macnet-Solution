/**
 * Mock seed data for Macnet Solutions. Every project, testimonial, team member and
 * post created here is flagged isMock: true.
 * Run: pnpm db:seed  (clears content collections; keeps users, upserts the seed admin)
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { TESTIMONIALS } from "./testimonials";

const db = new PrismaClient();

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/\+/g, "-plus")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const doc = (...paras: string[]) => ({
  type: "doc",
  content: paras.map((text) => ({ type: "paragraph", content: [{ type: "text", text }] })),
});

const BRANDS = [
  { name: "Cambium", website: "https://www.cambiumnetworks.com", description: "Wireless broadband, enterprise Wi-Fi and switching managed with cnMaestro." },
  { name: "Cisco", website: "https://www.cisco.com", description: "Enterprise switching, routing and security." },
  { name: "Tenda", website: "https://www.tendacn.com", description: "Switches, routers and Wi-Fi for homes, SMBs and outdoor links." },
  { name: "Rosenberger", website: "https://www.rosenberger.com", description: "Fibre and copper connectivity, patch panels and cabinets." },
  { name: "TP-Link", website: "https://www.tp-link.com", description: "Omada SDN switches, access points and gateways." },
];

const SERVICES = [
  { title: "Network design", summary: "Site surveys, topology and VLAN design, capacity planning and bills of materials before anything is bought.", points: ["Site survey and Wi-Fi heat-mapping", "Topology, VLAN and IP plans", "Bill of materials across brands", "Redundancy and growth planning"] },
  { title: "Structured cabling", summary: "Cat6/Cat6A and fibre backbones, racks and patching, labelled and tested to standard.", points: ["Cat6 / Cat6A horizontal runs", "Single-mode and multimode fibre", "Rack build and cable management", "Test and certification reports"] },
  { title: "Installation and configuration", summary: "Racking, firmware, configuration and hand-over of switches, routers, Wi-Fi and firewalls.", points: ["Switch, router and firewall configuration", "Controller setup (cnMaestro, Omada, Tenda)", "Firewall policy and VPN", "As-built documentation"] },
  { title: "AMC support", summary: "Annual maintenance contracts with response times, spares and scheduled health checks.", points: ["Defined response times", "On-site and remote support", "Spare-unit swaps", "Quarterly health checks"] },
];

const PROJECTS = [
  { title: "Campus Wi-Fi for a private university", client: "Private university (sample)", sector: "Education", location: "Dhaka", year: 2025, summary: "Wi-Fi 6 coverage across four academic buildings with a 10G fibre backbone.", results: [{ value: "180", label: "access points" }, { value: "6,000", label: "concurrent users" }, { value: "10G", label: "fibre backbone" }] },
  { title: "Branch network roll-out for a bank", client: "Commercial bank (sample)", sector: "Banking", location: "Dhaka, Chattogram, Sylhet", year: 2024, summary: "Standardised firewall, switch and VPN stack across 24 branches.", results: [{ value: "24", label: "branches" }, { value: "48 h", label: "per-branch cut-over" }, { value: "99.9%", label: "uptime target" }] },
  { title: "Garment factory floor network", client: "RMG manufacturer (sample)", sector: "Manufacturing", location: "Gazipur", year: 2025, summary: "Cabling and PoE switching for production-line terminals and CCTV.", results: [{ value: "3", label: "production floors" }, { value: "420", label: "cable drops" }, { value: "96", label: "PoE cameras" }] },
  { title: "Hospital core and data room upgrade", client: "Private hospital (sample)", sector: "Healthcare", location: "Dhaka", year: 2024, summary: "Redundant core switching and a rebuilt 42U data room.", results: [{ value: "2", label: "redundant cores" }, { value: "42U", label: "racks rebuilt" }, { value: "0", label: "unplanned downtime" }] },
  { title: "ISP aggregation upgrade", client: "Regional ISP (sample)", sector: "ISP", location: "Mymensingh", year: 2023, summary: "Cisco edge routing and 10G aggregation for subscriber growth.", results: [{ value: "10G", label: "aggregation" }, { value: "12k", label: "subscribers" }, { value: "BGP", label: "dual upstream" }] },
  { title: "Corporate office fit-out", client: "Software company (sample)", sector: "Corporate", location: "Dhaka", year: 2025, summary: "Cabling, Cambium Wi-Fi and gateway for a new three-floor office.", results: [{ value: "3", label: "floors" }, { value: "24", label: "access points" }, { value: "2 wks", label: "install time" }] },
];

async function main() {
  console.log("Clearing content collections…");
  await db.activity.deleteMany();
  await db.lead.deleteMany();
  await db.project.deleteMany();
  await db.brand.deleteMany();
  await db.service.deleteMany();
  await db.post.deleteMany();
  await db.testimonial.deleteMany();
  await db.teamMember.deleteMany();
  await db.pageSection.deleteMany();
  await db.office.deleteMany();
  await db.siteSettings.deleteMany();

  for (const [i, b] of BRANDS.entries()) {
    await db.brand.create({ data: { ...b, slug: slugify(b.name), order: i } });
  }

  for (const pr of PROJECTS) {
    await db.project.create({
      data: {
        ...pr,
        slug: slugify(pr.title),
        challenge: doc("Sample case study. The client needed reliable coverage and capacity without disrupting daily operations."),
        solution: doc("Macnet surveyed the site, designed the topology, ran the cabling and configured the equipment in phases out of hours."),
        cover: { url: "/placeholders/project.svg", alt: `${pr.title} (placeholder)`, width: 800, height: 600 },
        gallery: [],
        isMock: true,
      },
    });
  }

  for (const [i, sv] of SERVICES.entries()) {
    await db.service.create({ data: { ...sv, slug: slugify(sv.title), order: i, body: doc(sv.summary) } });
  }

  for (const [i, t] of TESTIMONIALS.entries()) await db.testimonial.create({ data: { ...t, order: i } });

  const team = [
    { name: "Team Member 1", role: "Managing Director" },
    { name: "Team Member 2", role: "Head of Engineering" },
    { name: "Team Member 3", role: "Network Engineer" },
    { name: "Team Member 4", role: "Sales Manager" },
  ];
  for (const [i, m] of team.entries()) {
    await db.teamMember.create({
      data: { ...m, order: i, isMock: true, photo: { url: "/placeholders/person.svg", alt: `${m.name} (placeholder)`, width: 800, height: 600 } },
    });
  }

  const posts = [
    { title: "Choosing PoE switches: budget, not just port count", excerpt: "How to size a PoE budget for cameras, phones and access points before you buy.", tags: ["Switching", "PoE"] },
    { title: "Wi-Fi 6 or Wi-Fi 7 for offices in 2026", excerpt: "Where the 6 GHz band helps, and where Wi-Fi 6 is still the right buy.", tags: ["Wireless"] },
    { title: "Cat6 or Cat6A for a new building?", excerpt: "Cable choice, distances and what 10G to the desk really needs.", tags: ["Cabling"] },
  ];
  for (const [i, p] of posts.entries()) {
    await db.post.create({
      data: {
        ...p,
        slug: slugify(p.title),
        body: doc(p.excerpt, "Sample article body. Replace this with the published post from the CMS."),
        cover: { url: "/placeholders/post.svg", alt: `${p.title} (placeholder)`, width: 800, height: 600 },
        author: "Macnet Solutions",
        status: "PUBLISHED",
        publishedAt: new Date(Date.UTC(2026, 9, 1 + i * 14)),
        isMock: true,
      },
    });
  }

  const phones = ["+880 1750148979"];
  await db.office.createMany({
    data: [
      { label: "Office", address: "Haque Chamber, 89/2 Panthapath (Suite 3A), Dhaka", phones, email: "info@macnetsolutions.com.bd", order: 0 },
    ],
  });

  await db.siteSettings.create({
    data: {
      key: "site",
      data: {
        name: "Macnet Solutions",
        tagline: "Networking hardware, supplied and installed",
        email: "info@macnetsolutions.com.bd",
        phones,
        whatsapp: "+880 1750148979",
      },
    },
  });

  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) throw new Error("SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set");
  const passwordHash = await bcrypt.hash(password, 12);
  await db.user.upsert({
    where: { email },
    update: { passwordHash, role: "ADMIN", active: true },
    create: { email, name: "Administrator", passwordHash, role: "ADMIN" },
  });
  console.log(`Admin user ready: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
