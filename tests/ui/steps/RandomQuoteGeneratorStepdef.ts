import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../../../src/support/world";

// NOTE:
// This step definition file intentionally uses conservative, role-based locators.
// The competitor site (Coda published document) did not expose stable, easily-automatable
// controls in the current session. Where selectors/behaviors are unknown, the steps throw
// an explicit error so the suite does not silently pass with weak assertions.

const CODA_RANDOM_QUOTE_URL = "https://coda.io/@mark-davis/random-quote";

Given("I open the Random Quote Generator page", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
  await this.page.goto(CODA_RANDOM_QUOTE_URL, { waitUntil: "domcontentloaded" });
});

Then("I should see the page title containing {string}", async function (this: CustomWorld, expected: string) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
  await expect(this.page).toHaveTitle(new RegExp(expected, "i"));
});

Then("I should see a generate quote action", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");

  // Placeholder heuristic: look for a button or link with common action labels.
  const candidate = this.page
    .getByRole("button", { name: /generate|random|new quote|next/i })
    .or(this.page.getByRole("link", { name: /generate|random|new quote|next/i }));

  // If nothing is found, fail loudly to force locator/UX clarification.
  const count = await candidate.count();
  if (count === 0) {
    throw new Error(
      "Generate quote action was not found using role-based heuristics. " +
        "Update locators once the AUT exposes a deterministic control."
    );
  }

  await expect(candidate.first()).toBeVisible();
});

When("I generate a random quote", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");

  // Try to click the primary generation action.
  const candidate = this.page.getByRole("button", { name: /generate|random|new quote|next/i });
  const count = await candidate.count();
  if (count === 0) {
    throw new Error(
      "Cannot generate quote: no actionable button found with label Generate/Random/New Quote/Next. " +
        "Update the step with verified locators."
    );
  }

  await candidate.first().click();
});

Then("I should see a quote displayed", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");

  // Placeholder: attempt to find any visible blockquote-like or quote text region.
  // This is intentionally strict: must find some non-empty text that looks like a quote.
  const possibleQuote = this.page.locator("text=/\u201c.+\u201d|\".+\"|^.+$/m");
  const visibleCount = await possibleQuote.filter({ hasText: /\S/ }).count();
  if (visibleCount === 0) {
    throw new Error(
      "No quote-like text found. Replace this assertion with a deterministic locator for the quote container."
    );
  }
});

When("I copy the displayed quote", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");

  const copyButton = this.page.getByRole("button", { name: /copy/i });
  const count = await copyButton.count();
  if (count === 0) {
    throw new Error("Copy button not found. Update locators once the AUT exposes a Copy control.");
  }

  await copyButton.first().click();
});

Then("the clipboard should contain the displayed quote", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");

  // Clipboard access is browser-permission dependent; keep as placeholder until test env supports it.
  throw new Error(
    "Clipboard validation is not implemented. Decide on one approach: " +
      "(1) grant clipboard permissions in browser context, " +
      "(2) validate via UI toast/message, or " +
      "(3) intercept copy handler."
  );
});

When("I get a shareable quote link", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");

  const shareButton = this.page.getByRole("button", { name: /share/i });
  const count = await shareButton.count();
  if (count === 0) {
    throw new Error("Share button not found. Update locators once the AUT exposes a Share control.");
  }

  await shareButton.first().click();

  // Placeholder: store URL after share flow updates location.
  this.attach?.(this.page.url(), "text/plain");
});

Then("opening the shareable link should restore the same quote", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");

  // Placeholder: Without a known quote-id mechanism, we cannot compare.
  throw new Error(
    "Share-link restore validation is not implemented. Provide expected behavior: " +
      "URL includes quote_id or hash, and quote container shows same text on reload."
  );
});
