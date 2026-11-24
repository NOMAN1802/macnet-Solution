import { expect, test } from "@playwright/test";

test.describe("Product page", () => {
  test("direct load renders product details", async ({ page }) => {
    await page.goto("/products?brand=tenda");
    const href = await page.getByRole("main").locator("a[href^='/products/']").first().getAttribute("href");
    const res = await page.goto(href!);
    expect(res?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Specifications" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Request a quote/ }).first()).toBeVisible();
  });

  test("client navigation from list to product and between related products", async ({ page }) => {
    await page.goto("/products?brand=rosenberger");
    const card = page.getByRole("main").locator("a[href^='/products/']").first();
    const href = await card.getAttribute("href");
    await card.click();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
    await expect(page.getByRole("heading", { name: "Specifications" })).toBeVisible();

    const related = page.locator("section").filter({ hasText: "More in" }).locator("a[href^='/products/']").first();
    await related.scrollIntoViewIfNeeded();
    const next = await related.getAttribute("href");
    await related.click();
    await expect(page).toHaveURL(new RegExp(`${next}$`));
    await expect(page.getByRole("heading", { name: "Specifications" })).toBeVisible();
  });

  test("unknown product shows not-found and is noindex", async ({ page }) => {
    await page.goto("/products/does-not-exist-xyz");
    await expect(page.getByText(/not found/i).first()).toBeVisible();
    await expect(page.locator("meta[name='robots'][content*='noindex']").first()).toBeAttached();
  });
});
