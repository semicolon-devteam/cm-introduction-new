import { test, expect } from "@playwright/test";

test.describe("Admin PartTimers Page - Authentication", () => {
  test("should redirect to login when not authenticated", async ({ page }) => {
    await page.goto("/admin/part-timers");
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("should have redirectTo parameter in login URL", async ({ page }) => {
    await page.goto("/admin/part-timers");
    const url = page.url();
    expect(url).toContain("redirectTo=%2Fadmin%2Fpart-timers");
  });

  test("should show login form", async ({ page }) => {
    await page.goto("/admin/part-timers");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("div.text-2xl").filter({ hasText: "로그인" })).toBeVisible();
    await expect(page.getByRole("button", { name: "로그인", exact: true })).toBeVisible();
  });
});
