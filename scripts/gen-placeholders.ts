/**
 * Generates neutral line-drawing SVG placeholders for projects, posts and team members. Real photography replaces these via the CMS later.
 * Run: pnpm tsx scripts/gen-placeholders.ts
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "public/placeholders");
mkdirSync(OUT, { recursive: true });

const W = 800;
const H = 600;
const ink = "#232631";
const rail = "#8A8D99";
const paper = "#F6F7F9";
const line = "#E2E4E9";
const cyan = "#FD384A";

function frame(inner: string, label: string) {
  const grid = Array.from({ length: 11 }, (_, i) => `<line x1="${(i + 1) * 66.6}" y1="0" x2="${(i + 1) * 66.6}" y2="${H}" stroke="${line}" stroke-width="1"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${label} placeholder">
<rect width="${W}" height="${H}" fill="${paper}"/>${grid}
${inner}
<text x="32" y="${H - 28}" font-family="ui-monospace, monospace" font-size="16" fill="${rail}" letter-spacing="1">${label.toUpperCase()} · PLACEHOLDER</text>
</svg>`;
}

const shapes: Record<string, string> = {
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
