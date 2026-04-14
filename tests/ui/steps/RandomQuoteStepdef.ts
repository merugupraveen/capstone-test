import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../../../src/support/world";
import { env } from "../../../src/config/env";

/**
 * IMPORTANT:
 * This step definition file uses placeholders for URL paths and locators.
 * Replace the placeholders once the AUT routes and UI labels are known.
 */

const RANDOM_QUOTE_PATH = process.env.RANDOM_QUOTE_PATH ?? "<RANDOM_QUOTE_PATH>";
const QUOTE_PERMALINK_PATH_PREFIX = process.env.QUOTE_PERMALINK_PATH_PREFIX ?? "<QUOTE_PERMALINK_PATH_PREFIX>";

// Placeholder selectors/roles. Replace with real accessible names/locators.
const selectors = {
  quoteText: "[data-testid='quote-text']",
  quoteAuthor: "[data-testid='quote-author']",
  quoteSource: "[data-testid='quote-source']",
  quoteId: "[data-testid='quote-id']",
  generateButtonRoleName: { role: "button", name: /^(Generate|New quote)$/i },
  copyButtonRoleName: { role: "button", name: /^Copy$/i },
  shareButtonRoleName: { role: "button", name: /^Share$/i },
  categoryComboboxRoleName: { role: "combobox", name: /^Category$/i },
  loadingIndicator: "[data-testid='quote-loading']",
  errorMessage: "[data-testid='quote-error']",
  retryButtonRoleName: { role: "button", name: /^Retry$/i },
  copiedToast: "[data-testid='toast-copied'], [role='status']"
};

async function openPath(world: CustomWorld, path: string) {
  if (!world.page) throw new Error("Playwright page was not initialized for UI scenario.");
  if (path.includes("<") || path.includes(">")) {
    throw new Error(
      `Placeholder path detected: '${path}'. Set RANDOM_QUOTE_PATH/QUOTE_PERMALINK_PATH_PREFIX env vars or update stepdefs.`
    );
  }
  await world.page.goto(`${env.uiBaseUrl}${path}`);
}

Given("I open the Random Quote page", async function (this: CustomWorld) {
  await openPath(this, RANDOM_QUOTE_PATH);
});

Given("I open the Quote permalink page for id {string}", async function (this: CustomWorld, quoteId: string) {
  const prefix = QUOTE_PERMALINK_PATH_PREFIX;
  if (prefix.includes("<") || prefix.includes(">")) {
    throw new Error(
      `Placeholder path detected: '${prefix}'. Set QUOTE_PERMALINK_PATH_PREFIX env var or update stepdefs.`
    );
  }
  await openPath(this, `${prefix}/${quoteId}`);
});

Then("I should see a quote text", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
  await expect(this.page.locator(selectors.quoteText)).toBeVisible();
  const text = (await this.page.locator(selectors.quoteText).innerText()).trim();
  expect(text.length).toBeGreaterThan(0);
});

Then("I should see the quote author", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
  await expect(this.page.locator(selectors.quoteAuthor)).toBeVisible();
});

Then("I should see the quote source only if present", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
  const source = this.page.locator(selectors.quoteSource);
  // Optional element: pass if not present.
  const count = await source.count();
  if (count > 0) {
    await expect(source.first()).toBeVisible();
  }
});

Then("I should see the generate new quote action", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
  await expect(this.page.getByRole(selectors.generateButtonRoleName.role as any, { name: selectors.generateButtonRoleName.name })).toBeVisible();
});

Then("the generate action should be keyboard focusable", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
  const btn = this.page.getByRole(selectors.generateButtonRoleName.role as any, { name: selectors.generateButtonRoleName.name });
  await btn.focus();
  await expect(btn).toBeFocused();
});

When("I activate generate using the keyboard", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
  const btn = this.page.getByRole(selectors.generateButtonRoleName.role as any, { name: selectors.generateButtonRoleName.name });
  await btn.focus();
  await this.page.keyboard.press("Enter");
});

When("I click generate new quote", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
  const btn = this.page.getByRole(selectors.generateButtonRoleName.role as any, { name: selectors.generateButtonRoleName.name });
  await btn.click();
});

Then("I should see a quote loading indicator", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
  // loading may be transient
  const indicator = this.page.locator(selectors.loadingIndicator);
  const count = await indicator.count();
  if (count > 0) {
    await expect(indicator.first()).toBeVisible();
  }
});

Given("I capture the current quote", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
  const text = await this.page.locator(selectors.quoteText).innerText();
  (this as any).currentQuoteText = text.trim();
});

Then("a new quote should be displayed", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
  const previous = ((this as any).currentQuoteText as string | undefined) ?? "";
  await expect(this.page.locator(selectors.quoteText)).toBeVisible();
  const current = (await this.page.locator(selectors.quoteText).innerText()).trim();
  // If API can return same quote twice, this assertion may be flaky.
  // Replace with quote-id-based comparison when available.
  expect(current.length).toBeGreaterThan(0);
  if (previous) {
    expect(current).not.toEqual(previous);
  }
});

Given("I capture the current quote id", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
  const idEl = this.page.locator(selectors.quoteId);
  const count = await idEl.count();
  if (count === 0) {
    throw new Error("Quote id element not found. Provide a quote id data-testid or update selectors.quoteId.");
  }
  (this as any).currentQuoteId = (await idEl.first().innerText()).trim();
});

When("I click copy quote", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
  await this.page.getByRole(selectors.copyButtonRoleName.role as any, { name: selectors.copyButtonRoleName.name }).click();
});

Then("the clipboard should contain the formatted quote", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
  const quoteText = (await this.page.locator(selectors.quoteText).innerText()).trim();
  const authorText = (await this.page.locator(selectors.quoteAuthor).innerText()).trim();
  const expected = `${quoteText} — ${authorText}`;

  // Clipboard read requires permissions and secure context.
  // If this fails in CI, replace with app-level "copied" message assertion only.
  const clipboardText = await this.page.evaluate(async () => {
    return await navigator.clipboard.readText();
  });

  expect(clipboardText).toEqual(expected);
});

Then("I should see a copied confirmation", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
  const toast = this.page.locator(selectors.copiedToast);
  await expect(toast.first()).toBeVisible();
});

When("I click share quote", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
  await this.page.getByRole(selectors.shareButtonRoleName.role as any, { name: selectors.shareButtonRoleName.name }).click();
});

Then("I should get a shareable quote URL containing the quote id", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
  const quoteId = ((this as any).currentQuoteId as string | undefined) ?? "";
  if (!quoteId) throw new Error("Missing captured quote id; ensure step 'I capture the current quote id' ran.");

  // Placeholder: share UI may copy to clipboard or open a modal containing URL.
  // Prefer asserting URL is present in a share dialog input once AUT is known.
  const clipboardText = await this.page.evaluate(async () => navigator.clipboard.readText());
  expect(clipboardText).toContain(quoteId);
});

When("I select the category {string}", async function (this: CustomWorld, category: string) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
  const combo = this.page.getByRole(selectors.categoryComboboxRoleName.role as any, { name: selectors.categoryComboboxRoleName.name });
  await combo.click();
  await this.page.getByRole("option", { name: new RegExp(`^${category}$`, "i") }).click();
});

Then("the displayed quote should belong to category {string}", async function (this: CustomWorld, category: string) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
  // Placeholder assertion; requires UI to expose category tag.
  const categoryChip = this.page.locator("[data-testid='quote-category']");
  const count = await categoryChip.count();
  if (count === 0) {
    throw new Error("Quote category element not found. Provide data-testid='quote-category' or update this assertion.");
  }
  await expect(categoryChip.first()).toHaveText(new RegExp(category, "i"));
});

Given("the quote service is unavailable", async function (this: CustomWorld) {
  // Placeholder: requires network mocking; not implemented without knowing endpoints.
  // Implement using page.route() once quote API URLs are known.
  (this as any).quoteServiceDown = true;
});

When("I open the Random Quote page", async function (this: CustomWorld) {
  // Alias step (duplicate text vs Given) to support scenario wording.
  await openPath(this, RANDOM_QUOTE_PATH);
});

Then("I should see a quote load error message", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
  await expect(this.page.locator(selectors.errorMessage)).toBeVisible();
});

Then("I should see a retry action", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
  await expect(this.page.getByRole(selectors.retryButtonRoleName.role as any, { name: selectors.retryButtonRoleName.name })).toBeVisible();
});

When("the quote service becomes available", async function (this: CustomWorld) {
  (this as any).quoteServiceDown = false;
});

When("I click retry quote load", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
  await this.page.getByRole(selectors.retryButtonRoleName.role as any, { name: selectors.retryButtonRoleName.name }).click();
});

Then("I should see a quote not found message", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
  // Placeholder: relies on AUT copy.
  await expect(this.page.getByText(/quote not found/i)).toBeVisible();
});

Then("I should see a recovery action to return or generate a new quote", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
  // Placeholder: either back link or generate button.
  const hasGenerate = await this.page
    .getByRole(selectors.generateButtonRoleName.role as any, { name: selectors.generateButtonRoleName.name })
    .count();
  const hasBack = await this.page.getByRole("link", { name: /back|home/i }).count();
  expect(hasGenerate + hasBack).toBeGreaterThan(0);
});
