import { test, expect } from "@playwright/test";

/**
 * testing the load command
 */

/**
 * navigate to the page before each test
 */
test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:8000/");
});

/**
 * test for submitting a valid broadband command
 */
test("valid broadband request", async ({ page }) => {
  await expect(
    page.getByLabel("Command Input Box to type in commands")
  ).toBeVisible();
  await page
    .getByLabel("Command Input Box to type in commands")
    .fill("broadband North_Carolina Durham");
  await page.click("button");
  await expect(page.locator(".repl-history ul")).toBeVisible();
  const allListItems = page.locator(".history-element .text-box");
  const firstItem = await allListItems.nth(0);
  await expect(firstItem).toContainText("broadband access percent: 90");

  await expect(
    page.getByLabel("Command Input Box to type in commands")
  ).toBeVisible();
  await page
    .getByLabel("Command Input Box to type in commands")
    .fill("broadband North_Carolina Orange");
  await page.click("button");
  await expect(page.locator(".repl-history ul")).toBeVisible();
  const secondListItem = await allListItems.nth(1);
  await expect(secondListItem).toContainText("broadband access percent: 89.1");

  await expect(
    page.getByLabel("Command Input Box to type in commands")
  ).toBeVisible();
  await page
    .getByLabel("Command Input Box to type in commands")
    .fill("broadband North_Carolina Durham");
  await page.click("button");
  await expect(page.locator(".repl-history ul")).toBeVisible();
  const thirdListItem = await allListItems.nth(2);
  await expect(thirdListItem).toContainText("broadband access percent: 90");
});

/**
 * test for invalid state broadband commands
 */
test("invalid broadband request - invalid state", async ({ page }) => {
  await expect(
    page.getByLabel("Command Input Box to type in commands")
  ).toBeVisible();
  await page
    .getByLabel("Command Input Box to type in commands")
    .fill("broadband North_Carlina Durham");
  await page.click("button");
  await expect(page.locator(".repl-history ul")).toBeVisible();
  const allListItems = page.locator(".history-element .text-box");
  const firstItem = await allListItems.nth(0);
  await expect(firstItem).toContainText(
    "Output: State North Carlina is not a valid state name."
  );
});

/**
 * test for invalid county broadband commands
 */
test("invalid broadband request - invalid county", async ({ page }) => {
  await expect(
    page.getByLabel("Command Input Box to type in commands")
  ).toBeVisible();
  await page
    .getByLabel("Command Input Box to type in commands")
    .fill("broadband North_Carolina Ornage");
  await page.click("button");
  await expect(page.locator(".repl-history ul")).toBeVisible();
  const allListItems = page.locator(".history-element .text-box");
  const firstItem = await allListItems.nth(0);
  await expect(firstItem).toContainText(
    "Output: County Ornage not found in state North Carolina."
  );
});

/**
 * test for invalid state and county broadband commands
 */
test("invalid broadband request - invalid county and state", async ({
  page,
}) => {
  await expect(
    page.getByLabel("Command Input Box to type in commands")
  ).toBeVisible();
  await page
    .getByLabel("Command Input Box to type in commands")
    .fill("broadband North_Carlina Ornage");
  await page.click("button");
  await expect(page.locator(".repl-history ul")).toBeVisible();
  const allListItems = page.locator(".history-element .text-box");
  const firstItem = await allListItems.nth(0);
  await expect(firstItem).toContainText(
    "Output: State North Carlina is not a valid state name."
  );
});

/**
 * test for missing parameters in broadband request
 */
test("invalid broadband request - missing parameters", async ({ page }) => {
  await page
    .getByLabel("Command Input Box to type in commands")
    .fill("broadband state");
  await page.click("button");
  await expect(page.locator(".repl-history ul")).toBeVisible();
  const allListItems = page.locator(".history-element .text-box");
  const firstItem = await allListItems.nth(0);
  await expect(firstItem).toContainText(
    "Output: Invalid broadband retrieval command. Usage: broadband <state> <county>"
  );
});

/**
 * test for additional parameters in broadband request
 */
test("invalid broadband request - additional parameters", async ({ page }) => {
  await page
    .getByLabel("Command Input Box to type in commands")
    .fill("broadband state county additional");
  await page.click("button");
  await expect(page.locator(".repl-history ul")).toBeVisible();
  const allListItems = page.locator(".history-element .text-box");
  const firstItem = await allListItems.nth(0);
  await expect(firstItem).toContainText(
    "Output: Invalid broadband retrieval command. Usage: broadband <state> <county>"
  );
});

/**
 * test for loading multiple files. (testing that the previous file is replaced
 * is done implicitly in search and view tests)
 */
test("submitting multiple valid load commands", async ({ page }) => {
  await expect(
    page.getByLabel("Command Input Box to type in commands")
  ).toBeVisible();
  await page
    .getByLabel("Command Input Box to type in commands")
    .fill("load data/census/dol_ri_earnings_disparity.csv");
  await page.click("button");
  const allListItems = page.locator(".history-element .text-box");
  const firstItem = await allListItems.nth(0);
  await expect(firstItem).toContainText(
    "Output: File data/census/dol_ri_earnings_disparity.csv loaded successfully"
  );

  await page
    .getByLabel("Command Input Box to type in commands")
    .fill("load data/custom/empty.csv");
  await page.click("button");
  const secondListItem = await allListItems.nth(1);
  await expect(secondListItem).toContainText(
    "Output: File data/custom/empty.csv loaded successfully"
  );
});
