import { expect, test } from "@playwright/test";

const ADDRESS = "Haque Chamber, 89/2 Panthapath (Suite 3A), Dhaka";
const EMAIL = "info@macnetsolutions.com.bd";
const PHONE = "+880 1750148979";
const BRANDS = ["Cambium", "Cisco", "Tenda", "Rosenberger", "TP-Link"];
const CLIENTS = ["Pacific Jeans", "1000Fix", "TechBee", "Icon Technology Solutions"];

test.describe("Logo", () => {
  test("header and footer show the logo image and it loads", async ({ page }) => {
    await page.goto("/");
    for (const scope of [page.locator("header"), page.locator("footer")]) {
      const logo = scope.getByRole("img", { name: "Macnet Solutions" }).first();
      await logo.scrollIntoViewIfNeeded();
      await expect(logo).toBeVisible();
      await expect.poll(() => logo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    }
    // dark header/footer use the white variant
    await expect(page.locator("footer img[alt='Macnet Solutions']")).toHaveAttribute("src", /macnet-logo-white/);
  });

  test("logo links home", async ({ page }) => {
    await page.goto("/contact");
    await page.locator("header").getByRole("link", { name: "Macnet Solutions home" }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("brand files are served", async ({ request }) => {
    for (const f of ["macnet-logo.png", "macnet-logo-white.png"]) {
      const res = await request.get(`/brand/${f}`);
      expect(res.status()).toBe(200);
      expect(res.headers()["content-type"]).toContain("image/png");
    }
  });
});

test.describe("Contact details", () => {
  test("footer shows new address, email and phone; old details are gone", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer.getByText(ADDRESS).first()).toBeVisible();
    await expect(footer.getByRole("link", { name: EMAIL }).first()).toHaveAttribute("href", `mailto:${EMAIL}`);
    await expect(footer.getByRole("link", { name: PHONE }).first()).toHaveAttribute("href", "tel:+8801750148979");
    const html = await page.content();
    for (const old of ["sales@macnetsolution", "arif@macnetsolutions", "1841778669", "Mitford", "Panthapoth"]) {
      expect(html, `old detail "${old}" still on page`).not.toContain(old);
    }
  });

  test("contact page shows one office with map link and the new email", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByText(ADDRESS).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Open in Google Maps" })).toHaveCount(1);
    await expect(page.getByRole("link", { name: "Open in Google Maps" })).toHaveAttribute("href", /Haque%20Chamber/);
    await expect(page.getByRole("main").getByRole("link", { name: EMAIL }).first()).toBeVisible();
  });

  test("WhatsApp links use the new number", async ({ page }) => {
    await page.goto("/");
    const wa = page.locator("a[href*='wa.me']");
    expect(await wa.count()).toBeGreaterThan(0);
    for (const href of await wa.evaluateAll((as) => as.map((a) => a.getAttribute("href")))) {
      expect(href).toContain("wa.me/8801750148979");
    }
  });
});

test.describe("Brands", () => {
  test("home brand section lists exactly the five brands", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("section[aria-labelledby='brands-title']");
    await section.scrollIntoViewIfNeeded();
    await expect(section.getByRole("listitem")).toHaveCount(BRANDS.length);
    for (const b of BRANDS) {
      const logo = section.getByRole("img", { name: b, exact: true });
      await logo.scrollIntoViewIfNeeded();
      await expect(logo).toBeVisible();
      await expect.poll(() => logo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    }
  });
});

test.describe("Clients", () => {
  test("home page lists all clients", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("section[aria-labelledby='clients-list-title']");
    await section.scrollIntoViewIfNeeded();
    await expect(section.getByRole("heading", { name: "Businesses That Run on Our Networks" })).toBeVisible();
    await expect(section.getByRole("listitem")).toHaveCount(CLIENTS.length);
    for (const c of CLIENTS) {
      const logo = section.getByRole("img", { name: c, exact: true });
      await logo.scrollIntoViewIfNeeded();
      await expect(logo).toBeVisible();
      await expect.poll(() => logo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    }
  });
});

test.describe("About", () => {
  test("shows the Bangladesh Computer Samity membership highlight", async ({ page }) => {
    await page.goto("/");
    const badge = page.locator("#about .member-badge");
    await badge.scrollIntoViewIfNeeded();
    await expect(badge).toBeVisible();
    await expect(badge).toContainText("Proud member of");
    await expect(badge).toContainText("Bangladesh Computer Samity (BCS)");
  });
});

test.describe("Favicon", () => {
  test("serves the Macnet icon, not the Next.js default", async ({ page, request }) => {
    await page.goto("/");
    const href = await page.locator("link[rel='icon'][type='image/png']").first().getAttribute("href");
    expect(href).toContain("/icon.png");
    const res = await request.get(href!);
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("image/png");
  });
});

test.describe("Theme", () => {
  test("accent colour is the logo teal", async ({ page }) => {
    await page.goto("/");
    const accent = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--red").trim());
    expect(accent.toLowerCase()).toBe("#148a93");
  });
});

test("no console errors on key pages", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  for (const path of ["/", "/contact", "/quote"]) {
    const res = await page.goto(path);
    expect(res?.status(), path).toBe(200);
  }
  expect(errors).toEqual([]);
});

test.describe("Products removed", () => {
  test("product pages return 404", async ({ request }) => {
    for (const path of ["/products", "/products/some-old-product"]) {
      const res = await request.get(path);
      expect(res.status(), path).toBe(404);
    }
  });

  test("no links to /products anywhere on key pages", async ({ page }) => {
    for (const path of ["/", "/contact", "/quote"]) {
      await page.goto(path);
      await expect(page.locator("a[href^='/products']"), path).toHaveCount(0);
    }
  });
});
