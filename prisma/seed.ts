/**
 * Mock seed data for Macnet Solutions. Every product, project, testimonial, team member and
 * post created here is flagged isMock: true. Spec values are illustrative, not datasheet-verified.
 * Run: pnpm db:seed  (clears content collections; keeps users, upserts the seed admin)
 */
import { PrismaClient, type StockStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

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
  { name: "Ubiquiti", website: "https://ui.com", description: "UniFi managed Wi-Fi, switching and gateways." },
  { name: "Cisco", website: "https://www.cisco.com", description: "Enterprise switching, routing and security." },
  { name: "Tenda", website: "https://www.tendacn.com", description: "Switches, routers and Wi-Fi for homes, SMBs and outdoor links." },
  { name: "Rosenberger", website: "https://www.rosenberger.com", description: "Fibre and copper connectivity, patch panels and cabinets." },
  { name: "TP-Link", website: "https://www.tp-link.com", description: "Omada SDN switches, access points and gateways." },
];

const CATEGORIES = [
  { name: "Switches", slug: "switches", description: "Access, aggregation and core switches, PoE and non-PoE.", specTemplate: ["Ports", "Uplinks", "PoE budget", "Switching capacity", "Layer", "Rack units"] },
  { name: "Routers", slug: "routers", description: "Branch, edge and ISP routers.", specTemplate: ["WAN ports", "LAN ports", "Throughput", "CPU", "RAM", "VPN"] },
  { name: "Wireless access points", slug: "wireless-access-points", description: "Indoor, outdoor and high-density Wi-Fi 6 and 7 access points.", specTemplate: ["Wi-Fi standard", "Radios", "Max data rate", "Clients", "Power", "Mounting"] },
  { name: "Firewalls", slug: "firewalls", description: "Next-generation firewalls and security gateways.", specTemplate: ["Firewall throughput", "Threat throughput", "VPN throughput", "Ports", "Concurrent sessions", "Form factor"] },
  { name: "Fibre and SFP", slug: "fibre-and-sfp", description: "SFP, SFP+ transceivers, DAC cables and media converters.", specTemplate: ["Form factor", "Data rate", "Wavelength", "Reach", "Connector", "Fibre type"] },
  { name: "Cabling and racks", slug: "cabling-and-racks", description: "Cat6/Cat6A cabling, patch panels and server racks.", specTemplate: ["Type", "Rating", "Ports or size", "Material", "Standard", "Use"] },
];

type Row = [string, string, string];
type P = { brand: string; name: string; sku: string; pitch: string; specs: Row[]; stock?: StockStatus; featured?: boolean };

const g = (group: string, rows: [string, string][]): Row[] => rows.map(([l, v]) => [group, l, v]);

// Spec helpers per category keep the product table compact.
const sw = (ports: string, up: string, poe: string, cap: string, layer: string, ru: string) => [
  ...g("Ports", [["Ports", ports], ["Uplinks", up]]),
  ...g("Power", [["PoE budget", poe]]),
  ...g("Performance", [["Switching capacity", cap], ["Layer", layer]]),
  ...g("Physical", [["Rack units", ru]]),
];
const rt = (wan: string, lan: string, tp: string, cpu: string, ram: string, vpn: string) => [
  ...g("Interfaces", [["WAN ports", wan], ["LAN ports", lan]]),
  ...g("Performance", [["Throughput", tp], ["CPU", cpu], ["RAM", ram]]),
  ...g("Features", [["VPN", vpn]]),
];
const ap = (std: string, radios: string, rate: string, clients: string, power: string, mount: string) => [
  ...g("Radio", [["Wi-Fi standard", std], ["Radios", radios], ["Max data rate", rate]]),
  ...g("Capacity", [["Clients", clients]]),
  ...g("Physical", [["Power", power], ["Mounting", mount]]),
];
const fw = (fwt: string, threat: string, vpn: string, ports: string, sess: string, form: string) => [
  ...g("Performance", [["Firewall throughput", fwt], ["Threat throughput", threat], ["VPN throughput", vpn]]),
  ...g("Interfaces", [["Ports", ports]]),
  ...g("Capacity", [["Concurrent sessions", sess]]),
  ...g("Physical", [["Form factor", form]]),
];
const op = (ff: string, rate: string, wl: string, reach: string, conn: string, fibre: string) => [
  ...g("Optics", [["Form factor", ff], ["Data rate", rate], ["Wavelength", wl], ["Reach", reach]]),
  ...g("Connection", [["Connector", conn], ["Fibre type", fibre]]),
];
const cb = (type: string, rating: string, size: string, mat: string, std: string, use: string) => [
  ...g("Cable", [["Type", type], ["Rating", rating], ["Ports or size", size]]),
  ...g("Build", [["Material", mat], ["Standard", std], ["Use", use]]),
];

const PRODUCTS: Record<string, P[]> = {
  switches: [
    { brand: "Tenda", name: "TEG1126P-24-410W", sku: "MOCK-TD-TEG1126P", featured: true, pitch: "24-port gigabit PoE switch with two SFP uplinks for cameras and APs.", specs: sw("24 × 1G RJ45 PoE+", "2 × 1G SFP", "370 W", "52 Gbps", "L2 unmanaged", "1U") },
    { brand: "Tenda", name: "TEG3328F", sku: "MOCK-TD-TEG3328F", pitch: "Managed L3 switch with 24 SFP and 4 × 10G SFP+ for aggregation.", specs: sw("24 × 1G SFP", "4 × 10G SFP+", "None", "128 Gbps", "L3", "1U") },
    { brand: "Cisco", name: "Catalyst 9200L-24P-4G", sku: "C9200L-24P-4G-E", featured: true, pitch: "24-port PoE+ access switch with 4×1G uplinks for campus edges.", specs: sw("24 × 1G RJ45 PoE+", "4 × 1G SFP", "370 W", "56 Gbps", "L3 lite", "1U") },
    { brand: "Cisco", name: "Catalyst 1000-48FP-4X", sku: "C1000-48FP-4X-L", pitch: "48-port full-PoE switch with 10G uplinks for dense branch offices.", specs: sw("48 × 1G RJ45 PoE+", "4 × 10G SFP+", "740 W", "176 Gbps", "L2", "1U") },
    { brand: "Ubiquiti", name: "UniFi Switch Pro 24 PoE", sku: "USW-PRO-24-POE", pitch: "Layer 3 UniFi switch with 16 PoE+ and 8 PoE++ ports.", specs: sw("24 × 1G RJ45 (16 PoE+, 8 PoE++)", "2 × 10G SFP+", "400 W", "88 Gbps", "L3", "1U") },
    { brand: "Ubiquiti", name: "UniFi Switch Lite 8 PoE", sku: "USW-LITE-8-POE", pitch: "Compact 8-port gigabit switch with four PoE+ ports.", specs: sw("8 × 1G RJ45 (4 PoE+)", "None", "52 W", "16 Gbps", "L2", "Desktop") },
    { brand: "TP-Link", name: "Omada SG3428XMP", sku: "TL-SG3428XMP", featured: true, pitch: "24-port PoE+ managed switch with 4 × 10G SFP+ for Omada SDN networks.", specs: sw("24 × 1G RJ45 PoE+", "4 × 10G SFP+", "384 W", "128 Gbps", "L2+", "1U") },
    { brand: "TP-Link", name: "Omada SG2210P", sku: "TL-SG2210P", pitch: "8-port PoE+ smart switch with 2 SFP slots for small offices.", specs: sw("8 × 1G RJ45 PoE+", "2 × 1G SFP", "61 W", "20 Gbps", "L2", "Desktop / 1U kit") },
  ],
  routers: [
    { brand: "Tenda", name: "G3 Gigabit VPN Router", sku: "MOCK-TD-G3", pitch: "Multi-WAN gigabit VPN router for small offices.", specs: rt("Up to 4 × 1G", "1–4 × 1G", "Up to 1 Gbps", "Dual-core", "256 MB", "IPsec, L2TP, PPTP") },
    { brand: "Cisco", name: "ISR 1100-4P", sku: "C1111-4P", pitch: "Integrated services router for branch offices with SD-WAN support.", specs: rt("2 × 1G combo", "4 × 1G", "Up to 1 Gbps", "Multi-core", "4 GB", "IPsec, DMVPN") },
    { brand: "Cisco", name: "Catalyst 8200-1N-4T", sku: "C8200-1N-4T", stock: "ON_ORDER", pitch: "Edge platform for SD-WAN and secure branch routing.", specs: rt("4 × 1G", "1 × NIM slot", "Up to 1 Gbps IPsec", "8-core", "8 GB", "IPsec, SD-WAN") },
    { brand: "Ubiquiti", name: "UniFi Cloud Gateway Ultra", sku: "UCG-ULTRA", pitch: "Compact UniFi gateway with built-in controller.", specs: rt("1 × 2.5G", "4 × 1G", "1 Gbps with IDS/IPS", "4-core ARM", "3 GB", "WireGuard, OpenVPN, site-to-site") },
    { brand: "Ubiquiti", name: "UniFi Dream Machine Pro", sku: "UDM-PRO", featured: true, pitch: "Rack-mount gateway with UniFi apps, IDS/IPS and 10G SFP+.", specs: rt("1 × 1G, 1 × 10G SFP+", "8 × 1G, 1 × 10G SFP+", "3.5 Gbps with IDS/IPS", "4-core ARM 1.7 GHz", "4 GB", "WireGuard, L2TP, site-to-site") },
    { brand: "TP-Link", name: "Omada ER7206", sku: "ER7206", pitch: "Multi-WAN VPN router managed from the Omada controller.", specs: rt("Up to 4 × 1G", "Up to 4 × 1G, 1 × SFP", "Up to 1 Gbps", "Quad-core", "512 MB", "IPsec, OpenVPN, L2TP, PPTP") },
  ],
  "wireless-access-points": [
    { brand: "Tenda", name: "i29 Ceiling AP", sku: "MOCK-TD-I29", featured: true, pitch: "Ceiling-mount Wi-Fi 6 access point with central management.", specs: ap("Wi-Fi 6", "2.4 GHz 2×2, 5 GHz 2×2", "1.8 Gbps", "Up to 128", "PoE 802.3af/at", "Ceiling / wall") },
    { brand: "Tenda", name: "O3 Outdoor CPE", sku: "MOCK-TD-O3", pitch: "Outdoor 2.4 GHz point-to-point bridge for building-to-building links.", specs: ap("Wi-Fi 4", "2.4 GHz 2×2", "150 Mbps", "Point-to-point", "Passive PoE", "Pole mount") },
    { brand: "Ubiquiti", name: "UniFi U6 Pro", sku: "U6-PRO", featured: true, pitch: "Ceiling-mount Wi-Fi 6 access point for 300+ clients.", specs: ap("Wi-Fi 6 (802.11ax)", "2.4 GHz 2×2, 5 GHz 4×4", "5.3 Gbps", "300+", "PoE+ (802.3at)", "Ceiling / wall") },
    { brand: "Ubiquiti", name: "UniFi U6 Mesh", sku: "U6-MESH", pitch: "Weather-resistant Wi-Fi 6 access point for indoor and outdoor mesh.", specs: ap("Wi-Fi 6", "2.4 GHz 2×2, 5 GHz 4×4", "5.3 Gbps", "300+", "PoE", "Pole / wall / desk") },
    { brand: "Ubiquiti", name: "UniFi U7 Pro", sku: "U7-PRO", stock: "ON_ORDER", pitch: "Tri-band Wi-Fi 7 access point with 6 GHz.", specs: ap("Wi-Fi 7", "2.4 / 5 / 6 GHz", "9.3 Gbps", "300+", "PoE+", "Ceiling / wall") },
    { brand: "TP-Link", name: "Omada EAP670", sku: "EAP670", featured: true, pitch: "AX5400 ceiling-mount Wi-Fi 6 access point with 2.5G uplink.", specs: ap("Wi-Fi 6", "2.4 GHz 2×2, 5 GHz 4×4", "5.4 Gbps", "500+", "PoE+", "Ceiling / wall") },
    { brand: "TP-Link", name: "Omada EAP225-Outdoor", sku: "EAP225-OUTDOOR", pitch: "AC1200 outdoor access point, IP65 weatherproof.", specs: ap("Wi-Fi 5", "2.4 GHz 2×2, 5 GHz 2×2", "1.2 Gbps", "100+", "Passive PoE / 802.3af", "Pole / wall") },
    { brand: "Cisco", name: "Catalyst 9120AXI", sku: "C9120AXI-E", pitch: "Enterprise Wi-Fi 6 access point for high-density campuses.", specs: ap("Wi-Fi 6", "2.4 GHz 4×4, 5 GHz 4×4", "5.38 Gbps", "400+", "PoE+", "Ceiling") },
  ],
  firewalls: [
    { brand: "Cisco", name: "Secure Firewall 1010", sku: "FPR1010-NGFW-K9", featured: true, pitch: "Desktop next-generation firewall for small offices and branches.", specs: fw("890 Mbps", "650 Mbps", "400 Mbps", "8 × 1G (2 PoE+)", "100,000", "Desktop") },
    { brand: "Cisco", name: "Secure Firewall 1120", sku: "FPR1120-NGFW-K9", stock: "ON_ORDER", pitch: "1U next-generation firewall for mid-size sites.", specs: fw("1.5 Gbps", "1.2 Gbps", "1 Gbps", "8 × 1G, 4 × SFP", "200,000", "1U") },
    { brand: "Cisco", name: "Meraki MX68", sku: "MX68-HW", pitch: "Cloud-managed security appliance for small branches.", specs: fw("600 Mbps", "300 Mbps", "300 Mbps", "12 × 1G (2 PoE+)", "Not published", "Desktop") },
    { brand: "Ubiquiti", name: "UniFi Next-Gen Gateway Pro", sku: "UXG-PRO", pitch: "Rack gateway with IDS/IPS for UniFi networks.", specs: fw("10 Gbps", "3.5 Gbps", "1 Gbps", "2 × 1G, 2 × 10G SFP+", "Not published", "1U") },
    { brand: "Ubiquiti", name: "UniFi Dream Machine SE", sku: "UDM-SE", pitch: "All-in-one gateway with PoE switching and IDS/IPS.", specs: fw("3.5 Gbps", "3.5 Gbps", "1 Gbps", "8 × 1G (PoE), 1 × 2.5G, 2 × 10G SFP+", "Not published", "1U") },
    { brand: "TP-Link", name: "Omada ER8411", sku: "ER8411", pitch: "Multi-WAN VPN router and firewall with 10G SFP+.", specs: fw("Up to 10 Gbps", "Not published", "Up to 1 Gbps", "8 × 1G, 2 × 10G SFP+", "500,000", "1U") },
    { brand: "TP-Link", name: "Omada ER605", sku: "ER605", pitch: "Gigabit multi-WAN VPN router for small offices.", specs: fw("Up to 1 Gbps", "Not published", "Up to 200 Mbps", "5 × 1G", "150,000", "Desktop") },
  ],
  "fibre-and-sfp": [
    { brand: "Rosenberger", name: "LC-LC OM4 Duplex Patch Cord 3 m", sku: "MOCK-RB-LC-OM4-3M", featured: true, pitch: "Low-loss multimode duplex patch cord for 10G and 40G links.", specs: op("Patch cord", "Up to 100 Gbps", "850 nm", "3 m", "LC-LC duplex", "OM4 multimode") },
    { brand: "Rosenberger", name: "1U Fibre Patch Panel 24 LC", sku: "MOCK-RB-FPP-24LC", pitch: "Sliding 1U fibre enclosure with 24 duplex LC adapters and splice trays.", specs: op("Fibre enclosure", "N/A", "Any", "N/A", "24 × LC duplex", "Single-mode or multimode") },
    { brand: "Rosenberger", name: "Single-mode Outdoor Cable 12F", sku: "MOCK-RB-OS2-12F", pitch: "12-core armoured single-mode cable for campus backbones.", specs: op("Fibre cable", "Up to 100 Gbps", "1310 / 1550 nm", "Up to 10 km", "Splice or pre-terminated", "OS2 single-mode") },
    { brand: "Cisco", name: "SFP-10G-SR", sku: "SFP-10G-SR", pitch: "10GBASE-SR multimode transceiver, 850 nm.", specs: op("SFP+", "10 Gbps", "850 nm", "300 m (OM3)", "Duplex LC", "Multimode") },
    { brand: "Cisco", name: "GLC-LH-SMD", sku: "GLC-LH-SMD", pitch: "1000BASE-LX/LH single-mode SFP, 1310 nm.", specs: op("SFP", "1 Gbps", "1310 nm", "10 km", "Duplex LC", "Single-mode") },
    { brand: "Ubiquiti", name: "UACC-OM-MM-10G-D-2", sku: "UACC-OM-MM-10G-D-2", pitch: "Pair of 10G multimode SFP+ modules.", specs: op("SFP+", "10 Gbps", "850 nm", "300 m", "Duplex LC", "Multimode") },
    { brand: "Ubiquiti", name: "UACC-DAC-SFP10-1M", sku: "UACC-DAC-SFP10-1M", pitch: "10G SFP+ direct-attach copper cable, 1 m.", specs: op("SFP+ DAC", "10 Gbps", "N/A (copper)", "1 m", "SFP+ to SFP+", "Twinax") },
    { brand: "TP-Link", name: "TL-SM5110-LR", sku: "TL-SM5110-LR", pitch: "10GBASE-LR single-mode SFP+ module.", specs: op("SFP+", "10 Gbps", "1310 nm", "10 km", "Duplex LC", "Single-mode") },
    { brand: "TP-Link", name: "MC220L", sku: "MC220L", pitch: "Gigabit SFP-to-RJ45 media converter.", specs: op("Media converter", "1 Gbps", "Module-dependent", "Module-dependent", "1 × SFP, 1 × RJ45", "Any (via SFP)") },
  ],
  "cabling-and-racks": [
    { brand: "Rosenberger", name: "Cat6 U/UTP Cable 305 m", sku: "MOCK-RB-C6-UTP-305", featured: true, pitch: "Cat6 U/UTP solid copper cable, 305 m box.", specs: cb("U/UTP solid", "Cat6, 250 MHz", "305 m reel", "23 AWG copper, LSZH", "ISO/IEC 11801", "Horizontal cabling") },
    { brand: "Rosenberger", name: "Cat6A F/UTP Cable 500 m", sku: "MOCK-RB-C6A-FUTP-500", pitch: "Shielded Cat6A for 10G runs, LSZH jacket.", specs: cb("F/UTP solid", "Cat6A, 500 MHz", "500 m drum", "23 AWG copper, LSZH", "ISO/IEC 11801", "10G horizontal cabling") },
    { brand: "Rosenberger", name: "24-port Cat6A Patch Panel", sku: "MOCK-RB-PP-C6A-24", pitch: "1U shielded patch panel with rear cable management.", specs: cb("Patch panel", "Cat6A", "24 ports, 1U", "Steel", "19-inch rack", "Comms room termination") },
    { brand: "Rosenberger", name: "Server Cabinet 42U 800×1000", sku: "MOCK-RB-RACK-42U", stock: "ON_ORDER", pitch: "Free-standing 42U cabinet with perforated doors.", specs: cb("Floor-standing rack", "1000 kg static", "42U, 800 × 1000 mm", "Cold-rolled steel", "19-inch, EIA-310", "Server and core network") },
    { brand: "TP-Link", name: "Cat6 Patch Cord 2 m (10-pack)", sku: "MOCK-TP-PC-C6-2M-10", pitch: "Snagless Cat6 patch cords for racks and desks.", specs: cb("Patch cord, stranded", "Cat6", "2 m × 10", "Copper, PVC", "TIA-568-C.2", "Patching") },
    { brand: "TP-Link", name: "Cat6 Keystone Jack (24-pack)", sku: "MOCK-TP-KJ-C6-24", pitch: "Tool-less Cat6 keystone jacks.", specs: cb("Keystone jack", "Cat6", "24 pieces", "Gold-plated contacts", "TIA-568-C.2", "Outlets and panels") },
    { brand: "Cisco", name: "Rack Mount Kit 19-inch", sku: "MOCK-CS-RMK-19", pitch: "Rack ears for compact Catalyst switches.", specs: cb("Mounting kit", "N/A", "19-inch", "Steel", "EIA-310", "Rack mounting") },
    { brand: "Ubiquiti", name: "UniFi Rack Mount Patch Panel", sku: "MOCK-UI-PP-KS-24", pitch: "1U keystone patch panel with brush passthrough.", specs: cb("Patch panel", "Keystone", "24 ports, 1U", "Aluminium", "19-inch rack", "Tidy patching") },
  ],
};

const SERVICES = [
  { title: "Network design", summary: "Site surveys, topology and VLAN design, capacity planning and bills of materials before anything is bought.", points: ["Site survey and Wi-Fi heat-mapping", "Topology, VLAN and IP plans", "Bill of materials across brands", "Redundancy and growth planning"] },
  { title: "Structured cabling", summary: "Cat6/Cat6A and fibre backbones, racks and patching, labelled and tested to standard.", points: ["Cat6 / Cat6A horizontal runs", "Single-mode and multimode fibre", "Rack build and cable management", "Test and certification reports"] },
  { title: "Installation and configuration", summary: "Racking, firmware, configuration and hand-over of switches, routers, Wi-Fi and firewalls.", points: ["Switch, router and firewall configuration", "Controller setup (UniFi, Omada, Tenda)", "Firewall policy and VPN", "As-built documentation"] },
  { title: "AMC support", summary: "Annual maintenance contracts with response times, spares and scheduled health checks.", points: ["Defined response times", "On-site and remote support", "Spare-unit swaps", "Quarterly health checks"] },
];

const PROJECTS = [
  { title: "Campus Wi-Fi for a private university", client: "Private university (sample)", sector: "Education", location: "Dhaka", year: 2025, summary: "Wi-Fi 6 coverage across four academic buildings with a 10G fibre backbone.", results: [{ value: "180", label: "access points" }, { value: "6,000", label: "concurrent users" }, { value: "10G", label: "fibre backbone" }] },
  { title: "Branch network roll-out for a bank", client: "Commercial bank (sample)", sector: "Banking", location: "Dhaka, Chattogram, Sylhet", year: 2024, summary: "Standardised firewall, switch and VPN stack across 24 branches.", results: [{ value: "24", label: "branches" }, { value: "48 h", label: "per-branch cut-over" }, { value: "99.9%", label: "uptime target" }] },
  { title: "Garment factory floor network", client: "RMG manufacturer (sample)", sector: "Manufacturing", location: "Gazipur", year: 2025, summary: "Cabling and PoE switching for production-line terminals and CCTV.", results: [{ value: "3", label: "production floors" }, { value: "420", label: "cable drops" }, { value: "96", label: "PoE cameras" }] },
  { title: "Hospital core and data room upgrade", client: "Private hospital (sample)", sector: "Healthcare", location: "Dhaka", year: 2024, summary: "Redundant core switching and a rebuilt 42U data room.", results: [{ value: "2", label: "redundant cores" }, { value: "42U", label: "racks rebuilt" }, { value: "0", label: "unplanned downtime" }] },
  { title: "ISP aggregation upgrade", client: "Regional ISP (sample)", sector: "ISP", location: "Mymensingh", year: 2023, summary: "Cisco edge routing and 10G aggregation for subscriber growth.", results: [{ value: "10G", label: "aggregation" }, { value: "12k", label: "subscribers" }, { value: "BGP", label: "dual upstream" }] },
  { title: "Corporate office fit-out", client: "Software company (sample)", sector: "Corporate", location: "Dhaka", year: 2025, summary: "Cabling, UniFi Wi-Fi and gateway for a new three-floor office.", results: [{ value: "3", label: "floors" }, { value: "24", label: "access points" }, { value: "2 wks", label: "install time" }] },
];

async function main() {
  console.log("Clearing content collections…");
  await db.activity.deleteMany();
  await db.lead.deleteMany();
  await db.product.deleteMany();
  await db.project.deleteMany();
  await db.category.deleteMany();
  await db.brand.deleteMany();
  await db.service.deleteMany();
  await db.post.deleteMany();
  await db.testimonial.deleteMany();
  await db.teamMember.deleteMany();
  await db.pageSection.deleteMany();
  await db.office.deleteMany();
  await db.siteSettings.deleteMany();

  const brands = new Map<string, string>();
  for (const [i, b] of BRANDS.entries()) {
    const row = await db.brand.create({ data: { ...b, slug: slugify(b.name), order: i } });
    brands.set(b.name, row.id);
  }

  const categories = new Map<string, string>();
  for (const [i, c] of CATEGORIES.entries()) {
    const row = await db.category.create({ data: { ...c, order: i } });
    categories.set(c.slug, row.id);
  }

  const productIds: string[] = [];
  for (const [catSlug, list] of Object.entries(PRODUCTS)) {
    for (const p of list) {
      const brandId = brands.get(p.brand);
      const categoryId = categories.get(catSlug);
      if (!brandId || !categoryId) throw new Error(`Bad reference for ${p.name}`);
      const full = `${p.brand} ${p.name}`;
      const row = await db.product.create({
        data: {
          name: full,
          slug: slugify(full),
          sku: p.sku,
          pitch: p.pitch,
          body: doc(
            `${p.pitch} Supplied, configured and supported by Macnet Solutions in Dhaka.`,
            "Sample listing: the specifications shown are illustrative and will be replaced with datasheet values.",
          ),
          specs: p.specs.map(([group, label, value]) => ({ group, label, value })),
          images: [{ url: `/placeholders/${catSlug}.svg`, alt: `${full} (placeholder image)`, width: 800, height: 600 }],
          stock: p.stock ?? "IN_STOCK",
          featured: p.featured ?? false,
          status: "PUBLISHED",
          isMock: true,
          categoryId,
          brandId,
          seo: { title: full, description: p.pitch },
        },
      });
      productIds.push(row.id);
    }
  }
  console.log(`Created ${productIds.length} products`);

  for (const [i, pr] of PROJECTS.entries()) {
    await db.project.create({
      data: {
        ...pr,
        slug: slugify(pr.title),
        challenge: doc("Sample case study. The client needed reliable coverage and capacity without disrupting daily operations."),
        solution: doc("Macnet surveyed the site, designed the topology, ran the cabling and configured the equipment in phases out of hours."),
        cover: { url: "/placeholders/project.svg", alt: `${pr.title} (placeholder)`, width: 800, height: 600 },
        gallery: [],
        productIds: productIds.slice(i * 7, i * 7 + 4),
        isMock: true,
      },
    });
  }

  for (const [i, sv] of SERVICES.entries()) {
    await db.service.create({ data: { ...sv, slug: slugify(sv.title), order: i, body: doc(sv.summary) } });
  }

  const testimonials = [
    { quote: "They planned the cut-over around our shifts. Production never stopped.", name: "Sample Client A", role: "IT Manager", company: "Manufacturing (sample)" },
    { quote: "Clear bill of materials, honest lead times, and the network has been quiet since.", name: "Sample Client B", role: "Head of IT", company: "Banking (sample)" },
    { quote: "The Wi-Fi survey alone paid for itself. Coverage is even across every floor.", name: "Sample Client C", role: "Facilities Lead", company: "Education (sample)" },
    { quote: "Fast quotes on mixed-brand orders, and they configure everything before delivery.", name: "Sample Client D", role: "Procurement", company: "Corporate (sample)" },
  ];
  for (const [i, t] of testimonials.entries()) await db.testimonial.create({ data: { ...t, order: i, isMock: true } });

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
