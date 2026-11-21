/**
 * Generates neutral line-drawing SVG placeholders for product categories, projects,
 * posts and team members. Real photography replaces these via the CMS later.
 * Run: pnpm tsx scripts/gen-placeholders.ts
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "public/placeholders");
mkdirSync(OUT, { recursive: true });

const W = 800;
const H = 600;
const ink = "#23235B";
const rail = "#8A8D99";
const paper = "#F4F3EE";
const line = "#D6D4CB";
const cyan = "#19B6D8";

function frame(inner: string, label: string) {
  const grid = Array.from({ length: 11 }, (_, i) => `<line x1="${(i + 1) * 66.6}" y1="0" x2="${(i + 1) * 66.6}" y2="${H}" stroke="${line}" stroke-width="1"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${label} placeholder">
<rect width="${W}" height="${H}" fill="${paper}"/>${grid}
${inner}
<text x="32" y="${H - 28}" font-family="ui-monospace, monospace" font-size="16" fill="${rail}" letter-spacing="1">${label.toUpperCase()} · PLACEHOLDER</text>
</svg>`;
}

function ports(x: number, y: number, n: number, w = 22, h = 16, gap = 6, color = ink) {
  return Array.from({ length: n }, (_, i) => `<rect x="${x + i * (w + gap)}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${color}" stroke-width="2"/>`).join("");
}

const shapes: Record<string, string> = {
  switches: `<rect x="60" y="230" width="680" height="110" fill="#fff" stroke="${ink}" stroke-width="3"/>
${ports(90, 255, 12)}${ports(90, 295, 12)}
<rect x="600" y="262" width="34" height="22" fill="none" stroke="${cyan}" stroke-width="2"/><rect x="644" y="262" width="34" height="22" fill="none" stroke="${cyan}" stroke-width="2"/>
<circle cx="700" cy="310" r="4" fill="#3DDC84"/>`,
  routers: `<rect x="120" y="240" width="560" height="100" fill="#fff" stroke="${ink}" stroke-width="3"/>
${ports(160, 280, 8, 26, 20, 10)}
<rect x="500" y="276" width="40" height="26" fill="none" stroke="${cyan}" stroke-width="2"/><rect x="552" y="276" width="40" height="26" fill="none" stroke="${cyan}" stroke-width="2"/>
<circle cx="630" cy="262" r="4" fill="#3DDC84"/><circle cx="645" cy="262" r="4" fill="${rail}"/>`,
  "wireless-access-points": `<circle cx="400" cy="290" r="150" fill="#fff" stroke="${ink}" stroke-width="3"/>
<circle cx="400" cy="290" r="110" fill="none" stroke="${line}" stroke-width="2"/>
<circle cx="400" cy="290" r="8" fill="${cyan}"/>
<path d="M320 160 Q400 110 480 160" fill="none" stroke="${cyan}" stroke-width="2"/><path d="M290 130 Q400 60 510 130" fill="none" stroke="${cyan}" stroke-width="2" opacity=".6"/>`,
  firewalls: `<rect x="100" y="220" width="600" height="130" fill="#fff" stroke="${ink}" stroke-width="3"/>
<rect x="130" y="250" width="120" height="70" fill="none" stroke="${ink}" stroke-width="2"/>
${ports(290, 265, 8, 24, 18, 8)}
<rect x="560" y="262" width="36" height="24" fill="none" stroke="${cyan}" stroke-width="2"/><rect x="606" y="262" width="36" height="24" fill="none" stroke="${cyan}" stroke-width="2"/>
<path d="M190 268 l0 16 M182 276 l16 0" stroke="${cyan}" stroke-width="2"/>`,
  "fibre-and-sfp": `<rect x="170" y="250" width="380" height="70" fill="#fff" stroke="${ink}" stroke-width="3"/>
<rect x="550" y="262" width="60" height="46" fill="none" stroke="${ink}" stroke-width="3"/>
<rect x="566" y="274" width="12" height="22" fill="${cyan}"/><rect x="584" y="274" width="12" height="22" fill="${cyan}"/>
<path d="M610 285 C 680 285, 690 180, 740 170" fill="none" stroke="${cyan}" stroke-width="3"/>
<line x1="200" y1="285" x2="520" y2="285" stroke="${line}" stroke-width="2"/>`,
  "cabling-and-racks": `<rect x="250" y="90" width="300" height="430" fill="#fff" stroke="${ink}" stroke-width="3"/>
${Array.from({ length: 9 }, (_, i) => `<rect x="275" y="${115 + i * 44}" width="250" height="32" fill="none" stroke="${i % 3 === 0 ? cyan : ink}" stroke-width="2"/>`).join("")}
<line x1="262" y1="100" x2="262" y2="510" stroke="${rail}" stroke-width="2" stroke-dasharray="4 6"/><line x1="538" y1="100" x2="538" y2="510" stroke="${rail}" stroke-width="2" stroke-dasharray="4 6"/>`,
  project: `<rect x="80" y="110" width="640" height="340" fill="#fff" stroke="${ink}" stroke-width="3"/>
<line x1="80" y1="190" x2="720" y2="190" stroke="${line}" stroke-width="2"/>
${[160, 300, 440, 580].map((x) => `<rect x="${x}" y="230" width="70" height="150" fill="none" stroke="${ink}" stroke-width="2"/><circle cx="${x + 35}" cy="250" r="4" fill="${cyan}"/>`).join("")}
<path d="M195 380 L335 410 L475 380 L615 410" fill="none" stroke="${cyan}" stroke-width="2"/>`,
  post: `<rect x="120" y="120" width="560" height="320" fill="#fff" stroke="${ink}" stroke-width="3"/>
${[0, 1, 2, 3, 4].map((i) => `<line x1="160" y1="${190 + i * 40}" x2="${i === 4 ? 460 : 640}" y2="${190 + i * 40}" stroke="${i === 0 ? ink : line}" stroke-width="${i === 0 ? 6 : 3}"/>`).join("")}
<rect x="160" y="150" width="60" height="10" fill="${cyan}"/>`,
  person: `<circle cx="400" cy="230" r="90" fill="#fff" stroke="${ink}" stroke-width="3"/>
<path d="M230 470 C 240 360, 560 360, 570 470" fill="#fff" stroke="${ink}" stroke-width="3"/>
<line x1="400" y1="395" x2="400" y2="430" stroke="${cyan}" stroke-width="3"/>`,
};

for (const [key, inner] of Object.entries(shapes)) {
  writeFileSync(join(OUT, `${key}.svg`), frame(inner, key.replace(/-/g, " ")));
}
console.log(`Wrote ${Object.keys(shapes).length} placeholders to public/placeholders`);
