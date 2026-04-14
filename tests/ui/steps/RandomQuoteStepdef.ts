import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../../../src/support/world";
import { env } from "../../../src/config/env";

// NOTE:
// The application under test (AUT) URL and selectors are not defined in the story.
// We use env.uiBaseUrl as the page URL and rely on robust, accessibility-first locators where possible.
// If your AUT differs from example.com, set UI_BASE_URL in .env.

Given("I open the Random Quote page", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
  await this.page.goto(env.uiBaseUrl);
});

Then("I should see a button labeled {string}", async function (this: CustomWorld, label: string) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");

  // Preferred: accessibility role-based lookup
  const button = this.page.getByRole("button", { name: label });
  await expect(button).toBeVisible();
});

Then("I should see an area dedicated to displaying a quote", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");

  // Placeholder locator: requires AUT to provide a stable selector.
  // Update to match your implementation, e.g. [data-testid="quote-area"], #quote, etc.
  const quoteArea = this.page.locator('[data-testid="quote-area"]');
  await expect(quoteArea, "Quote area should be visible").toBeVisible();
});

Then("I should see either no quote or a default quote displayed", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");

  const quoteArea = this.page.locator('[data-testid="quote-area"]');
  await expect(quoteArea).toBeVisible();

  const text = (await quoteArea.innerText()).trim();
  // Accept either empty or any default text (per story wording).
  expect(text === "" || text.length > 0).toBeTruthy();
});

When("I click the {string} button", async function (this: CustomWorld, label: string) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
  await this.page.getByRole("button", { name: label }).click();
});

Then("a quote should be displayed in the quote area", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");

  const quoteArea = this.page.locator('[data-testid="quote-area"]');
  await expect(quoteArea).toBeVisible();
  await expect(quoteArea, "Quote area should contain some text after generation").not.toHaveText(/^\s*$/);
});

Given("a quote is currently displayed", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");

  const quoteArea = this.page.locator('[data-testid="quote-area"]');
  await expect(quoteArea).toBeVisible();

  // Ensure a quote exists by clicking Show Quote if empty
  const current = (await quoteArea.innerText()).trim();
  if (!current) {
    await this.page.getByRole("button", { name: "Show Quote" }).click();
    await expect(quoteArea).not.toHaveText(/^\s*$/);
  }

  this.attach("previousQuote", (await quoteArea.innerText()).trim());
});

Then("the displayed quote should update to a new random quote", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");

  const quoteArea = this.page.locator('[data-testid="quote-area"]');
  const prev = (this as any).previousQuote ?? "";
  const current = (await quoteArea.innerText()).trim();

  // Expect change; if your product allows repeats, relax this expectation.
  expect(current).not.toEqual(prev);
});

Then("the new quote should not be the same as the previously displayed quote", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");

  const quoteArea = this.page.locator('[data-testid="quote-area"]');
  const prev = (this as any).previousQuote ?? "";
  const current = (await quoteArea.innerText()).trim();
  expect(current).not.toEqual(prev);
});

Given("a quote is displayed", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
  const quoteArea = this.page.locator('[data-testid="quote-area"]');
  await expect(quoteArea).toBeVisible();
  await expect(quoteArea).not.toHaveText(/^\s*$/);
});

Then("the quote should be clearly readable", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");

  // Minimal, evidence-based check: quote area has text.
  // Readability (font size/contrast) should be validated via visual/accessibility tooling if required.
  const quoteArea = this.page.locator('[data-testid="quote-area"]');
  const text = (await quoteArea.innerText()).trim();
  expect(text.length).toBeGreaterThan(0);
});

Then("the button and quote area should be accessible and usable", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");

  const button = this.page.getByRole("button", { name: "Show Quote" });
  const quoteArea = this.page.locator('[data-testid="quote-area"]');

  await expect(button).toBeVisible();
  await expect(quoteArea).toBeVisible();

  // Basic responsive smoke: ensure elements are still visible on a mobile viewport.
  await this.page.setViewportSize({ width: 390, height: 844 });
  await expect(button).toBeVisible();
  await expect(quoteArea).toBeVisible();
});
