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
  { name: "Cisco", website: "https://www.cisco.com", description: "Enterprise switching, routing and security." },
  { name: "MikroTik", website: "https://mikrotik.com", description: "RouterOS routers, switches and wireless for ISPs and SMBs." },
  { name: "Ubiquiti", website: "https://ui.com", description: "UniFi managed Wi-Fi, switching and gateways." },
  { name: "TP-Link", website: "https://www.tp-link.com", description: "Omada SDN switches, access points and gateways." },
  { name: "Ruijie", website: "https://www.ruijienetworks.com", description: "Campus switching and Reyee cloud-managed networks." },
  { name: "D-Link", website: "https://www.dlink.com", description: "Smart-managed switches and SMB networking." },
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
    { brand: "Cisco", name: "Catalyst 9200L-24P-4G", sku: "C9200L-24P-4G-E", featured: true, pitch: "24-port PoE+ access switch with 4×1G uplinks for campus edges.", specs: sw("24 × 1G RJ45 PoE+", "4 × 1G SFP", "370 W", "56 Gbps", "L3 lite", "1U") },
    { brand: "Cisco", name: "Catalyst 1000-48FP-4X", sku: "C1000-48FP-4X-L", pitch: "48-port full-PoE switch with 10G uplinks for dense branch offices.", specs: sw("48 × 1G RJ45 PoE+", "4 × 10G SFP+", "740 W", "176 Gbps", "L2", "1U") },
    { brand: "MikroTik", name: "CRS326-24G-2S+RM", sku: "CRS326-24G-2S+RM", featured: true, pitch: "24 gigabit ports and two SFP+ cages, dual-boot RouterOS / SwitchOS.", specs: sw("24 × 1G RJ45", "2 × 10G SFP+", "None", "88 Gbps", "L3 (RouterOS)", "1U") },
    { brand: "MikroTik", name: "CRS354-48P-4S+2Q+RM", sku: "CRS354-48P-4S+2Q+RM", stock: "ON_ORDER", pitch: "48-port PoE switch with SFP+ and 40G QSFP+ uplinks.", specs: sw("48 × 1G RJ45 PoE", "4 × 10G SFP+, 2 × 40G QSFP+", "750 W", "336 Gbps", "L3 (RouterOS)", "1U") },
    { brand: "Ubiquiti", name: "UniFi Switch Pro 24 PoE", sku: "USW-PRO-24-POE", pitch: "Layer 3 UniFi switch with 16 PoE+ and 8 PoE++ ports.", specs: sw("24 × 1G RJ45 (16 PoE+, 8 PoE++)", "2 × 10G SFP+", "400 W", "88 Gbps", "L3", "1U") },
    { brand: "Ubiquiti", name: "UniFi Switch Lite 8 PoE", sku: "USW-LITE-8-POE", pitch: "Compact 8-port gigabit switch with four PoE+ ports.", specs: sw("8 × 1G RJ45 (4 PoE+)", "None", "52 W", "16 Gbps", "L2", "Desktop") },
    { brand: "TP-Link", name: "Omada SG3428XMP", sku: "TL-SG3428XMP", featured: true, pitch: "24-port PoE+ managed switch with 4 × 10G SFP+ for Omada SDN networks.", specs: sw("24 × 1G RJ45 PoE+", "4 × 10G SFP+", "384 W", "128 Gbps", "L2+", "1U") },
    { brand: "TP-Link", name: "Omada SG2210P", sku: "TL-SG2210P", pitch: "8-port PoE+ smart switch with 2 SFP slots for small offices.", specs: sw("8 × 1G RJ45 PoE+", "2 × 1G SFP", "61 W", "20 Gbps", "L2", "Desktop / 1U kit") },
    { brand: "Ruijie", name: "RG-S2910-24GT4XS-E", sku: "RG-S2910-24GT4XS-E", pitch: "Enterprise L2+ access switch with 10G uplinks.", specs: sw("24 × 1G RJ45", "4 × 10G SFP+", "None", "336 Gbps", "L2+", "1U") },
    { brand: "D-Link", name: "DGS-1210-28P", sku: "DGS-1210-28P", stock: "DISCONTINUED", pitch: "28-port smart-managed PoE switch for SMB access layers.", specs: sw("24 × 1G RJ45 PoE", "4 × 1G combo SFP", "193 W", "56 Gbps", "L2", "1U") },
  ],
  routers: [
    { brand: "Cisco", name: "ISR 1100-4P", sku: "C1111-4P", pitch: "Integrated services router for branch offices with SD-WAN support.", specs: rt("2 × 1G combo", "4 × 1G", "Up to 1 Gbps", "Multi-core", "4 GB", "IPsec, DMVPN") },
    { brand: "Cisco", name: "Catalyst 8200-1N-4T", sku: "C8200-1N-4T", stock: "ON_ORDER", pitch: "Edge platform for SD-WAN and secure branch routing.", specs: rt("4 × 1G", "1 × NIM slot", "Up to 1 Gbps IPsec", "8-core", "8 GB", "IPsec, SD-WAN") },
    { brand: "MikroTik", name: "CCR2004-16G-2S+", sku: "CCR2004-16G-2S+", featured: true, pitch: "Cloud Core Router with 16 gigabit ports for ISP edges and BGP.", specs: rt("Any port", "16 × 1G, 2 × 10G SFP+", "Up to 18 Gbps (L3 fast-path)", "4-core ARM 1.7 GHz", "4 GB", "IPsec, WireGuard, L2TP") },
    { brand: "MikroTik", name: "RB5009UG+S+IN", sku: "RB5009UG+S+IN", pitch: "Desktop router with 2.5G and 10G SFP+ for branch edges.", specs: rt("1 × 2.5G", "7 × 1G, 1 × 10G SFP+", "Up to 9 Gbps", "4-core ARM 1.4 GHz", "1 GB", "IPsec, WireGuard") },
    { brand: "MikroTik", name: "hEX S", sku: "RB760iGS", pitch: "Five-port gigabit router with SFP for small sites.", specs: rt("1 × 1G", "4 × 1G, 1 × SFP", "Up to 1 Gbps", "2-core 880 MHz", "256 MB", "IPsec (hardware)") },
    { brand: "Ubiquiti", name: "UniFi Cloud Gateway Ultra", sku: "UCG-ULTRA", pitch: "Compact UniFi gateway with built-in controller.", specs: rt("1 × 2.5G", "4 × 1G", "1 Gbps with IDS/IPS", "4-core ARM", "3 GB", "WireGuard, OpenVPN, site-to-site") },
    { brand: "Ubiquiti", name: "UniFi Dream Machine Pro", sku: "UDM-PRO", featured: true, pitch: "Rack-mount gateway with UniFi apps, IDS/IPS and 10G SFP+.", specs: rt("1 × 1G, 1 × 10G SFP+", "8 × 1G, 1 × 10G SFP+", "3.5 Gbps with IDS/IPS", "4-core ARM 1.7 GHz", "4 GB", "WireGuard, L2TP, site-to-site") },
    { brand: "TP-Link", name: "Omada ER7206", sku: "ER7206", pitch: "Multi-WAN VPN router managed from the Omada controller.", specs: rt("Up to 4 × 1G", "Up to 4 × 1G, 1 × SFP", "Up to 1 Gbps", "Quad-core", "512 MB", "IPsec, OpenVPN, L2TP, PPTP") },
    { brand: "Ruijie", name: "RG-EG3230", sku: "RG-EG3230", stock: "ON_ORDER", pitch: "Reyee cloud gateway for multi-WAN branch networks.", specs: rt("Up to 4 × 1G", "6 × 1G, 2 × SFP", "Up to 3 Gbps", "Multi-core", "2 GB", "IPsec, L2TP") },
    { brand: "D-Link", name: "DSR-1000AC", sku: "DSR-1000AC", stock: "DISCONTINUED", pitch: "Unified services VPN router with built-in Wi-Fi.", specs: rt("2 × 1G", "4 × 1G", "Up to 950 Mbps", "Dual-core", "512 MB", "IPsec, SSL VPN") },
  ],
  "wireless-access-points": [
    { brand: "Ubiquiti", name: "UniFi U6 Pro", sku: "U6-PRO", featured: true, pitch: "Ceiling-mount Wi-Fi 6 access point for 300+ clients.", specs: ap("Wi-Fi 6 (802.11ax)", "2.4 GHz 2×2, 5 GHz 4×4", "5.3 Gbps", "300+", "PoE+ (802.3at)", "Ceiling / wall") },
    { brand: "Ubiquiti", name: "UniFi U6 Mesh", sku: "U6-MESH", pitch: "Weather-resistant Wi-Fi 6 access point for indoor and outdoor mesh.", specs: ap("Wi-Fi 6", "2.4 GHz 2×2, 5 GHz 4×4", "5.3 Gbps", "300+", "PoE", "Pole / wall / desk") },
    { brand: "Ubiquiti", name: "UniFi U7 Pro", sku: "U7-PRO", stock: "ON_ORDER", pitch: "Tri-band Wi-Fi 7 access point with 6 GHz.", specs: ap("Wi-Fi 7", "2.4 / 5 / 6 GHz", "9.3 Gbps", "300+", "PoE+", "Ceiling / wall") },
    { brand: "TP-Link", name: "Omada EAP670", sku: "EAP670", featured: true, pitch: "AX5400 ceiling-mount Wi-Fi 6 access point with 2.5G uplink.", specs: ap("Wi-Fi 6", "2.4 GHz 2×2, 5 GHz 4×4", "5.4 Gbps", "500+", "PoE+", "Ceiling / wall") },
    { brand: "TP-Link", name: "Omada EAP225-Outdoor", sku: "EAP225-OUTDOOR", pitch: "AC1200 outdoor access point, IP65 weatherproof.", specs: ap("Wi-Fi 5", "2.4 GHz 2×2, 5 GHz 2×2", "1.2 Gbps", "100+", "Passive PoE / 802.3af", "Pole / wall") },
    { brand: "Ruijie", name: "RG-RAP2260(G)", sku: "RG-RAP2260G", pitch: "Reyee Wi-Fi 6 ceiling access point for offices and hotels.", specs: ap("Wi-Fi 6", "2.4 GHz 2×2, 5 GHz 2×2", "1.775 Gbps", "256", "PoE", "Ceiling") },
    { brand: "Ruijie", name: "RG-RAP6262(G)", sku: "RG-RAP6262G", pitch: "Outdoor Wi-Fi 6 access point for campuses and parks.", specs: ap("Wi-Fi 6", "2.4 GHz 2×2, 5 GHz 2×2", "1.775 Gbps", "512", "PoE", "Pole / wall") },
    { brand: "Cisco", name: "Catalyst 9120AXI", sku: "C9120AXI-E", pitch: "Enterprise Wi-Fi 6 access point for high-density campuses.", specs: ap("Wi-Fi 6", "2.4 GHz 4×4, 5 GHz 4×4", "5.38 Gbps", "400+", "PoE+", "Ceiling") },
    { brand: "MikroTik", name: "cAP ax", sku: "CAPGI-5HAXD2HAXD", pitch: "Ceiling Wi-Fi 6 access point running RouterOS.", specs: ap("Wi-Fi 6", "2.4 GHz 2×2, 5 GHz 2×2", "1.8 Gbps", "128", "PoE-in", "Ceiling / wall") },
    { brand: "D-Link", name: "DBA-X1230P", sku: "DBA-X1230P", pitch: "Nuclias cloud-managed Wi-Fi 6 access point.", specs: ap("Wi-Fi 6", "2.4 GHz 2×2, 5 GHz 2×2", "1.8 Gbps", "128", "PoE", "Ceiling / wall") },
  ],
  firewalls: [
    { brand: "Cisco", name: "Secure Firewall 1010", sku: "FPR1010-NGFW-K9", featured: true, pitch: "Desktop next-generation firewall for small offices and branches.", specs: fw("890 Mbps", "650 Mbps", "400 Mbps", "8 × 1G (2 PoE+)", "100,000", "Desktop") },
    { brand: "Cisco", name: "Secure Firewall 1120", sku: "FPR1120-NGFW-K9", stock: "ON_ORDER", pitch: "1U next-generation firewall for mid-size sites.", specs: fw("1.5 Gbps", "1.2 Gbps", "1 Gbps", "8 × 1G, 4 × SFP", "200,000", "1U") },
    { brand: "Cisco", name: "Meraki MX68", sku: "MX68-HW", pitch: "Cloud-managed security appliance for small branches.", specs: fw("600 Mbps", "300 Mbps", "300 Mbps", "12 × 1G (2 PoE+)", "Not published", "Desktop") },
    { brand: "Ubiquiti", name: "UniFi Next-Gen Gateway Pro", sku: "UXG-PRO", pitch: "Rack gateway with IDS/IPS for UniFi networks.", specs: fw("10 Gbps", "3.5 Gbps", "1 Gbps", "2 × 1G, 2 × 10G SFP+", "Not published", "1U") },
    { brand: "Ubiquiti", name: "UniFi Dream Machine SE", sku: "UDM-SE", pitch: "All-in-one gateway with PoE switching and IDS/IPS.", specs: fw("3.5 Gbps", "3.5 Gbps", "1 Gbps", "8 × 1G (PoE), 1 × 2.5G, 2 × 10G SFP+", "Not published", "1U") },
    { brand: "TP-Link", name: "Omada ER8411", sku: "ER8411", pitch: "Multi-WAN VPN router and firewall with 10G SFP+.", specs: fw("Up to 10 Gbps", "Not published", "Up to 1 Gbps", "8 × 1G, 2 × 10G SFP+", "500,000", "1U") },
    { brand: "TP-Link", name: "Omada ER605", sku: "ER605", pitch: "Gigabit multi-WAN VPN router for small offices.", specs: fw("Up to 1 Gbps", "Not published", "Up to 200 Mbps", "5 × 1G", "150,000", "Desktop") },
    { brand: "Ruijie", name: "RG-WALL 1600-Z3200-S", sku: "RG-WALL-1600-Z3200-S", pitch: "Next-generation firewall for enterprise edges.", specs: fw("6 Gbps", "1.5 Gbps", "1 Gbps", "8 × 1G, 2 × SFP+", "1,500,000", "1U") },
    { brand: "MikroTik", name: "CCR2116-12G-4S+", sku: "CCR2116-12G-4S+", featured: true, pitch: "Cloud Core Router used as an edge firewall for high-throughput sites.", specs: fw("Up to 30 Gbps", "Rule-dependent", "Up to 6 Gbps IPsec", "12 × 1G, 4 × 10G SFP+", "Memory-bound (16 GB)", "1U") },
    { brand: "D-Link", name: "DFL-870", sku: "DFL-870", stock: "DISCONTINUED", pitch: "NetDefend UTM firewall for SMB networks.", specs: fw("2 Gbps", "250 Mbps", "500 Mbps", "8 × 1G", "400,000", "1U") },
  ],
  "fibre-and-sfp": [
    { brand: "Cisco", name: "SFP-10G-SR", sku: "SFP-10G-SR", pitch: "10GBASE-SR multimode transceiver, 850 nm.", specs: op("SFP+", "10 Gbps", "850 nm", "300 m (OM3)", "Duplex LC", "Multimode") },
    { brand: "Cisco", name: "GLC-LH-SMD", sku: "GLC-LH-SMD", pitch: "1000BASE-LX/LH single-mode SFP, 1310 nm.", specs: op("SFP", "1 Gbps", "1310 nm", "10 km", "Duplex LC", "Single-mode") },
    { brand: "MikroTik", name: "S+85DLC03D", sku: "S+85DLC03D", featured: true, pitch: "10G SFP+ multimode module, 300 m.", specs: op("SFP+", "10 Gbps", "850 nm", "300 m", "Duplex LC", "Multimode") },
    { brand: "MikroTik", name: "S+31DLC10D", sku: "S+31DLC10D", pitch: "10G SFP+ single-mode module, 10 km.", specs: op("SFP+", "10 Gbps", "1310 nm", "10 km", "Duplex LC", "Single-mode") },
    { brand: "Ubiquiti", name: "UACC-OM-MM-10G-D-2", sku: "UACC-OM-MM-10G-D-2", pitch: "Pair of 10G multimode SFP+ modules.", specs: op("SFP+", "10 Gbps", "850 nm", "300 m", "Duplex LC", "Multimode") },
    { brand: "Ubiquiti", name: "UACC-DAC-SFP10-1M", sku: "UACC-DAC-SFP10-1M", pitch: "10G SFP+ direct-attach copper cable, 1 m.", specs: op("SFP+ DAC", "10 Gbps", "N/A (copper)", "1 m", "SFP+ to SFP+", "Twinax") },
    { brand: "TP-Link", name: "TL-SM5110-LR", sku: "TL-SM5110-LR", pitch: "10GBASE-LR single-mode SFP+ module.", specs: op("SFP+", "10 Gbps", "1310 nm", "10 km", "Duplex LC", "Single-mode") },
    { brand: "TP-Link", name: "MC220L", sku: "MC220L", pitch: "Gigabit SFP-to-RJ45 media converter.", specs: op("Media converter", "1 Gbps", "Module-dependent", "Module-dependent", "1 × SFP, 1 × RJ45", "Any (via SFP)") },
    { brand: "Ruijie", name: "XG-SFP-SR-MM850", sku: "XG-SFP-SR-MM850", stock: "ON_ORDER", pitch: "10G SR multimode SFP+ transceiver.", specs: op("SFP+", "10 Gbps", "850 nm", "300 m", "Duplex LC", "Multimode") },
    { brand: "D-Link", name: "DEM-311GT", sku: "DEM-311GT", pitch: "1000BASE-SX multimode SFP transceiver.", specs: op("SFP", "1 Gbps", "850 nm", "550 m", "Duplex LC", "Multimode") },
  ],
  "cabling-and-racks": [
    { brand: "D-Link", name: "Cat6 UTP Cable 305 m", sku: "MOCK-D-C6-UTP-305", featured: true, pitch: "Cat6 U/UTP solid copper cable, 305 m box, grey.", specs: cb("U/UTP solid", "Cat6, 250 MHz", "305 m reel", "23 AWG copper, PVC", "TIA-568-C.2", "Horizontal cabling") },
    { brand: "D-Link", name: "Cat6A F/UTP Cable 305 m", sku: "MOCK-D-C6A-FUTP-305", pitch: "Shielded Cat6A for 10G runs, LSZH jacket.", specs: cb("F/UTP solid", "Cat6A, 500 MHz", "305 m reel", "23 AWG copper, LSZH", "TIA-568-C.2", "10G horizontal cabling") },
    { brand: "D-Link", name: "24-port Cat6 Patch Panel", sku: "MOCK-D-PP-C6-24", pitch: "1U Cat6 patch panel with rear cable management.", specs: cb("Patch panel", "Cat6", "24 ports, 1U", "Steel", "19-inch rack", "Comms room termination") },
    { brand: "D-Link", name: "Wall Mount Rack 9U", sku: "MOCK-D-RACK-9U-WM", pitch: "Wall-mount 9U network cabinet with glass door.", specs: cb("Wall-mount cabinet", "60 kg load", "9U, 600 × 450 mm", "Steel, tempered glass", "19-inch", "Branch comms") },
    { brand: "TP-Link", name: "Cat6 Patch Cord 2 m (10-pack)", sku: "MOCK-TP-PC-C6-2M-10", pitch: "Snagless Cat6 patch cords for racks and desks.", specs: cb("Patch cord, stranded", "Cat6", "2 m × 10", "Copper, PVC", "TIA-568-C.2", "Patching") },
    { brand: "TP-Link", name: "Cat6 Keystone Jack (24-pack)", sku: "MOCK-TP-KJ-C6-24", pitch: "Tool-less Cat6 keystone jacks.", specs: cb("Keystone jack", "Cat6", "24 pieces", "Gold-plated contacts", "TIA-568-C.2", "Outlets and panels") },
    { brand: "Cisco", name: "Rack Mount Kit 19-inch", sku: "MOCK-CS-RMK-19", pitch: "Rack ears for compact Catalyst switches.", specs: cb("Mounting kit", "N/A", "19-inch", "Steel", "EIA-310", "Rack mounting") },
    { brand: "Ubiquiti", name: "UniFi Rack Mount Patch Panel", sku: "MOCK-UI-PP-KS-24", pitch: "1U keystone patch panel with brush passthrough.", specs: cb("Patch panel", "Keystone", "24 ports, 1U", "Aluminium", "19-inch rack", "Tidy patching") },
    { brand: "Ruijie", name: "Server Rack 42U 800×1000", sku: "MOCK-RJ-RACK-42U", stock: "ON_ORDER", pitch: "Free-standing 42U server rack with perforated doors.", specs: cb("Floor-standing rack", "1000 kg static", "42U, 800 × 1000 mm", "Cold-rolled steel", "19-inch, EIA-310", "Server and core network") },
    { brand: "MikroTik", name: "Rack Mount Ears RMK-2/10", sku: "RMK-2-10", pitch: "Mounts two 10-inch MikroTik devices in a 19-inch rack.", specs: cb("Mounting kit", "N/A", "1U, 2 devices", "Steel", "19-inch", "Rack mounting") },
  ],
};

const SERVICES = [
  { title: "Network design", summary: "Site surveys, topology and VLAN design, capacity planning and bills of materials before anything is bought.", points: ["Site survey and Wi-Fi heat-mapping", "Topology, VLAN and IP plans", "Bill of materials across brands", "Redundancy and growth planning"] },
  { title: "Structured cabling", summary: "Cat6/Cat6A and fibre backbones, racks and patching, labelled and tested to standard.", points: ["Cat6 / Cat6A horizontal runs", "Single-mode and multimode fibre", "Rack build and cable management", "Test and certification reports"] },
  { title: "Installation and configuration", summary: "Racking, firmware, configuration and hand-over of switches, routers, Wi-Fi and firewalls.", points: ["Switch, router and firewall configuration", "Controller setup (UniFi, Omada, Reyee)", "Firewall policy and VPN", "As-built documentation"] },
  { title: "AMC support", summary: "Annual maintenance contracts with response times, spares and scheduled health checks.", points: ["Defined response times", "On-site and remote support", "Spare-unit swaps", "Quarterly health checks"] },
];

const PROJECTS = [
  { title: "Campus Wi-Fi for a private university", client: "Private university (sample)", sector: "Education", location: "Dhaka", year: 2025, summary: "Wi-Fi 6 coverage across four academic buildings with a 10G fibre backbone.", results: [{ value: "180", label: "access points" }, { value: "6,000", label: "concurrent users" }, { value: "10G", label: "fibre backbone" }] },
  { title: "Branch network roll-out for a bank", client: "Commercial bank (sample)", sector: "Banking", location: "Dhaka, Chattogram, Sylhet", year: 2024, summary: "Standardised firewall, switch and VPN stack across 24 branches.", results: [{ value: "24", label: "branches" }, { value: "48 h", label: "per-branch cut-over" }, { value: "99.9%", label: "uptime target" }] },
  { title: "Garment factory floor network", client: "RMG manufacturer (sample)", sector: "Manufacturing", location: "Gazipur", year: 2025, summary: "Cabling and PoE switching for production-line terminals and CCTV.", results: [{ value: "3", label: "production floors" }, { value: "420", label: "cable drops" }, { value: "96", label: "PoE cameras" }] },
  { title: "Hospital core and data room upgrade", client: "Private hospital (sample)", sector: "Healthcare", location: "Dhaka", year: 2024, summary: "Redundant core switching and a rebuilt 42U data room.", results: [{ value: "2", label: "redundant cores" }, { value: "42U", label: "racks rebuilt" }, { value: "0", label: "unplanned downtime" }] },
  { title: "ISP aggregation upgrade", client: "Regional ISP (sample)", sector: "ISP", location: "Mymensingh", year: 2023, summary: "MikroTik CCR edge routing and 10G aggregation for subscriber growth.", results: [{ value: "10G", label: "aggregation" }, { value: "12k", label: "subscribers" }, { value: "BGP", label: "dual upstream" }] },
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

  const phones = ["+880 1750148979", "+880 1841778669"];
  await db.office.createMany({
    data: [
      { label: "Head office", address: "Plot 18, Road 1, Armenian Street, Girja Market (1st floor), Mitford, Dhaka-1100", phones, email: "sales@macnetsolution.com.bd", order: 0 },
      { label: "Branch office", address: "59 Panthapoth (ground floor), Dhaka 1205", phones, email: "sales@macnetsolution.com.bd", order: 1 },
    ],
  });

  await db.siteSettings.create({
    data: {
      key: "site",
      data: {
        name: "Macnet Solutions",
        tagline: "Networking hardware, supplied and installed",
        email: "sales@macnetsolution.com.bd",
        altEmail: "arif@macnetsolutions.com.bd",
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
