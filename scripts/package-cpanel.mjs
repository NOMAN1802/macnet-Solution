/**
 * Builds the site for cPanel's Node.js app manager and zips it.
 *
 *   pnpm package:cpanel                # production: uses DATABASE_URL from .env.production
 *   pnpm package:cpanel --local-test   # allows a localhost DATABASE_URL (for testing on this Mac)
 *
 * Output: deploy/cpanel/ (upload contents) and deploy/macnet-cpanel.zip
 * No .env file is ever copied into the package; secrets are set in cPanel instead.
 */
import { execSync } from "node:child_process";
import { cpSync, existsSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { tmpdir } from "node:os";

const root = process.cwd();
const localTest = process.argv.includes("--local-test");
const out = join(root, "deploy", "cpanel");
const zipPath = join(root, "deploy", "macnet-cpanel.zip");

function readEnvFile(file) {
  if (!existsSync(file)) return {};
  const env = {};
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?(.*?)"?\s*$/);
    if (m) env[m[1]] = m[2];
  }
  return env;
}

// Same precedence as `next build`: shell > .env.production.local > .env.local > .env.production > .env
const layers = [".env.production.local", ".env.local", ".env.production", ".env"].map((f) => readEnvFile(join(root, f)));
const pick = (key) => process.env[key] ?? layers.map((l) => l[key]).find((v) => v !== undefined);
const envProd = { NEXT_PUBLIC_SITE_URL: pick("NEXT_PUBLIC_SITE_URL") };
const dbUrl = pick("DATABASE_URL") ?? "";
const isLocalDb = /localhost|127\.0\.0\.1/.test(dbUrl);
if (!dbUrl) {
  console.error("DATABASE_URL is not set. Put the Atlas URL in web/.env.production (see deploy/CPANEL-DEPLOY.md).");
  process.exit(1);
}
if (isLocalDb && !localTest) {
  console.error(
    "DATABASE_URL points at this Mac (localhost). Pages are pre-built from the database, so the production\n" +
      "package must be built against MongoDB Atlas. Add DATABASE_URL to web/.env.production, or pass --local-test.",
  );
  process.exit(1);
}
if (!localTest && !/^https:\/\//.test(envProd.NEXT_PUBLIC_SITE_URL ?? "")) {
  console.error("Set NEXT_PUBLIC_SITE_URL=https://macnetsolutions.com.bd in web/.env.production before building.");
  process.exit(1);
}

// Build in a temporary copy installed with a flat (hoisted) node_modules. pnpm's normal
// symlinked layout does not survive cPanel's zip extraction, and copying it flat breaks
// module resolution, so the standalone output must come from a hoisted install.
const buildDir = join(tmpdir(), "macnet-cpanel-build");
console.log(`Preparing build copy in ${buildDir} …`);
rmSync(buildDir, { recursive: true, force: true });
const SKIP = new Set(["node_modules", ".next", "deploy", "playwright-report", "test-results", "e2e", ".git"]);
cpSync(root, buildDir, {
  recursive: true,
  filter: (src) => {
    const rel = relative(root, src);
    if (!rel) return true;
    return !SKIP.has(rel.split(sep)[0]);
  },
});
const run = (cmd, extraEnv = {}) =>
  execSync(cmd, { cwd: buildDir, stdio: "inherit", env: { ...process.env, ...extraEnv } });
run("pnpm install --frozen-lockfile --prefer-offline --config.node-linker=hoisted");

console.log(`Building for cPanel (${localTest ? "LOCAL TEST" : "production"}) …`);
run("pnpm exec next build", { BUILD_TARGET: "cpanel" });

const standalone = join(buildDir, ".next", "standalone");
if (!existsSync(join(standalone, "server.js"))) {
  console.error("Expected .next/standalone/server.js. Is output: 'standalone' active?");
  process.exit(1);
}

console.log("Assembling deploy/cpanel …");
rmSync(out, { recursive: true, force: true });
// dereference the few symlinks Next.js creates (e.g. .next/node_modules externals)
cpSync(standalone, out, { recursive: true, dereference: true });
cpSync(join(buildDir, ".next", "static"), join(out, ".next", "static"), { recursive: true });
cpSync(join(buildDir, "public"), join(out, "public"), { recursive: true });

// Prisma: every Linux query engine next to the generated client; drop the Mac one for production.
const srcClient = join(buildDir, "node_modules", ".prisma", "client");
const dstClient = join(out, "node_modules", ".prisma", "client");
if (!existsSync(join(srcClient, "schema.prisma")) || !existsSync(dstClient)) {
  console.error("Could not find the generated Prisma client (node_modules/.prisma/client).");
  process.exit(1);
}
for (const f of readdirSync(srcClient)) {
  if (f.startsWith("libquery_engine-") || f === "schema.prisma") cpSync(join(srcClient, f), join(dstClient, f));
}
if (!localTest) {
  for (const f of readdirSync(dstClient)) if (f.includes("darwin")) rmSync(join(dstClient, f));
}
// Images are served unoptimised on cPanel, so the native sharp binaries are not needed.
for (const dir of [join(out, "node_modules", "sharp"), join(out, "node_modules", "@img")]) {
  rmSync(dir, { recursive: true, force: true });
}

// Remove anything secret or unneeded that tracing may have pulled in.
function walk(dir, fn) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walk(p, fn);
    else fn(p, entry.name);
  }
}
walk(out, (p, name) => {
  if (/^\.env/.test(name) || name === ".DS_Store") rmSync(p);
});

// Passenger (cPanel "Setup Node.js App") starts app.js; it wraps the standalone server.
writeFileSync(
  join(out, "app.js"),
  `// cPanel / Passenger entry point for the Macnet Solutions site.
process.env.NODE_ENV = "production";
process.env.HOSTNAME = process.env.HOSTNAME || "0.0.0.0";
process.env.PORT = process.env.PORT || "3000";
require("./server.js");
`,
);

rmSync(zipPath, { force: true });
execSync(`cd "${out}" && zip -qr -X "${zipPath}" .`, { stdio: "inherit" });

const listing = execSync(`unzip -Z1 "${zipPath}"`, { encoding: "utf8" });
const leaked = listing.split("\n").filter((l) => /(^|\/)\.env/.test(l));
if (leaked.length) {
  console.error("Refusing: .env files found in the zip:", leaked);
  rmSync(zipPath);
  process.exit(1);
}
rmSync(buildDir, { recursive: true, force: true }); // the copy contains .env files
const mb = (statSync(zipPath).size / 1024 / 1024).toFixed(1);
console.log(`\nPackage ready: deploy/macnet-cpanel.zip (${mb} MB)${localTest ? "  [LOCAL TEST BUILD: do not upload]" : ""}`);
