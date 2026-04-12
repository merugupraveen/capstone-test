import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../../../src/support/world";
import { env } from "../../../src/config/env";

/**
 * IMPORTANT
 * ---------
 * This repository currently contains only a sample UI test against https://example.com.
 * The Jira story EPMCDMETST-37419 describes an application with a Random Quote UI.
 * Since the application under test and its selectors are not present here,
 * selectors are implemented as placeholders and MUST be updated once the real UI is known.
 */

// ---- Placeholder selectors (update for your AUT) ----
const selectors = {
  showQuoteButton: "[data-testid='show-quote']", // TODO
  copyButton: "[data-testid='copy-quote']", // TODO
  favoriteButton: "[data-testid='favorite-quote']", // TODO
  unfavoriteButton: "[data-testid='unfavorite-quote']", // TODO
  quoteArea: "[data-testid='quote-area']", // TODO
  quoteText: "[data-testid='quote-text']", // TODO
  quoteAuthor: "[data-testid='quote-author']", // TODO
  toastMessage: "[role='status']", // TODO (or .toast)
  historyButton: "[data-testid='open-history']", // TODO
  historyListItems: "[data-testid='history-item']", // TODO
  favoritesButton: "[data-testid='open-favorites']", // TODO
  favoritesListItems: "[data-testid='favorite-item']", // TODO
  categorySelect: "[data-testid='category-select']", // TODO
};

type QuoteSnapshot = {
  text: string;
  author?: string;
};

async function readCurrentQuote(world: CustomWorld): Promise<QuoteSnapshot> {
  if (!world.page) throw new Error("Playwright page was not initialized for UI scenario.");

  const page = world.page;
  const text = (await page.locator(selectors.quoteText).textContent())?.trim() ?? "";

  // Author may be optional.
  const authorLocator = page.locator(selectors.quoteAuthor);
  const authorVisible = await authorLocator.isVisible().catch(() => false);
  const author = authorVisible ? (await authorLocator.textContent())?.trim() ?? "" : undefined;

  return { text, author };
}

async function clickBySelector(world: CustomWorld, css: string): Promise<void> {
  if (!world.page) throw new Error("Playwright page was not initialized for UI scenario.");
  await world.page.locator(css).click();
}

// ---- Given ----

Given("the application is loaded", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
  await this.page.goto(env.uiBaseUrl, { waitUntil: "domcontentloaded" });
});

Given("the application is configured with a quote source", async function (this: CustomWorld) {
  // Placeholder: configuration may be done via env, query param, local storage, etc.
  // Keep as a no-op until AUT contract is known.
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
});

Given("the quote source is unavailable", async function (this: CustomWorld) {
  // Placeholder: could be mocked via routing, service worker, or environment flag.
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
});

Given("the application has a local fallback quote list", async function (this: CustomWorld) {
  // Placeholder: no-op.
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
});

Given("a quote with an author is available", async function (this: CustomWorld) {
  // Placeholder: no-op.
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
});

Given("a quote without an author is available", async function (this: CustomWorld) {
  // Placeholder: no-op.
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
});

Given("a quote is displayed", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");

  // Ensure app is open
  await this.page.goto(env.uiBaseUrl, { waitUntil: "domcontentloaded" });

  // Click Show Quote to display a quote
  await clickBySelector(this, selectors.showQuoteButton);

  // Basic expectation: quote area becomes visible and contains some text
  await expect(this.page.locator(selectors.quoteArea)).toBeVisible();
  const quote = await readCurrentQuote(this);
  expect(quote.text.length).toBeGreaterThan(0);

  // Store for later comparisons
  (this as unknown as { currentQuote?: QuoteSnapshot }).currentQuote = quote;
});

Given("a quote exists in History", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");

  // Ensure app is open
  await this.page.goto(env.uiBaseUrl, { waitUntil: "domcontentloaded" });

  // Show at least one quote so History is populated
  await clickBySelector(this, selectors.showQuoteButton);
  await expect(this.page.locator(selectors.quoteArea)).toBeVisible();

  // Open History and ensure at least one item exists
  await clickBySelector(this, selectors.historyButton);
  await expect(this.page.locator(selectors.historyListItems).first()).toBeVisible();
});

Given("a quote is in my Favorites list", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");

  // Ensure app is open
  await this.page.goto(env.uiBaseUrl, { waitUntil: "domcontentloaded" });

  // Display a quote then favorite it
  await clickBySelector(this, selectors.showQuoteButton);
  await expect(this.page.locator(selectors.quoteArea)).toBeVisible();
  await clickBySelector(this, selectors.favoriteButton);

  // Open favorites and verify at least one favorite item is present
  await clickBySelector(this, selectors.favoritesButton);
  await expect(this.page.locator(selectors.favoritesListItems).first()).toBeVisible();
});

Given("categories are available", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
  await expect(this.page.locator(selectors.categorySelect)).toBeVisible();
});

// ---- When ----

When("I click the {string} button", async function (this: CustomWorld, buttonName: string) {
  const map: Record<string, string> = {
    "Show Quote": selectors.showQuoteButton,
    "Copy": selectors.copyButton,
  };

  const selector = map[buttonName];
  if (!selector) throw new Error(`No selector mapping defined for button: ${buttonName}`);

  await clickBySelector(this, selector);
});

When("a quote is shown", async function (this: CustomWorld) {
  // Trigger displaying a quote
  await clickBySelector(this, selectors.showQuoteButton);
  await expect(this.page!.locator(selectors.quoteArea)).toBeVisible();
});

When("I click \"Show Quote\" {int} times", async function (this: CustomWorld, count: number) {
  for (let i = 0; i < count; i++) {
    await clickBySelector(this, selectors.showQuoteButton);
  }
});

When("I select a quote from History", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");

  await clickBySelector(this, selectors.historyButton);
  const first = this.page.locator(selectors.historyListItems).first();
  await expect(first).toBeVisible();
  await first.click();
});

When("I click \"Favorite\"", async function (this: CustomWorld) {
  await clickBySelector(this, selectors.favoriteButton);
});

When("I click \"Unfavorite\" for that quote", async function (this: CustomWorld) {
  await clickBySelector(this, selectors.unfavoriteButton);
});

When("I select category {string}", async function (this: CustomWorld, category: string) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
  await this.page.selectOption(selectors.categorySelect, { label: category }).catch(async () => {
    // fallback if it's not a <select>
    await this.page.locator(selectors.categorySelect).click();
    await this.page.getByText(category, { exact: true }).click();
  });
});

When("I click \"Show Quote\" again", async function (this: CustomWorld) {
  // Capture previous quote first
  const prev = await readCurrentQuote(this);
  (this as unknown as { prevQuote?: QuoteSnapshot }).prevQuote = prev;

  await clickBySelector(this, selectors.showQuoteButton);
});

// ---- Then ----

Then(
  "a random quote from the configured source is displayed in the quote area",
  async function (this: CustomWorld) {
    if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
    await expect(this.page.locator(selectors.quoteArea)).toBeVisible();
    const quote = await readCurrentQuote(this);
    expect(quote.text.length).toBeGreaterThan(0);
  }
);

Then("a quote from the local fallback list is displayed", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
  const quote = await readCurrentQuote(this);
  expect(quote.text.length).toBeGreaterThan(0);
});

Then(
  "I see a non-blocking message that online quotes are temporarily unavailable",
  async function (this: CustomWorld) {
    if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
    await expect(this.page.locator(selectors.toastMessage)).toBeVisible();
  }
);

Then("the quote text is displayed", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
  const quote = await readCurrentQuote(this);
  expect(quote.text.length).toBeGreaterThan(0);
});

Then("the author name is displayed near the quote", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
  await expect(this.page.locator(selectors.quoteAuthor)).toBeVisible();
  const author = (await this.page.locator(selectors.quoteAuthor).textContent())?.trim() ?? "";
  expect(author.length).toBeGreaterThan(0);
});

Then("the author field displays \"Unknown\" or is hidden", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
  const authorLocator = this.page.locator(selectors.quoteAuthor);
  const visible = await authorLocator.isVisible().catch(() => false);
  if (!visible) return;
  const author = (await authorLocator.textContent())?.trim() ?? "";
  expect(author).toMatch(/unknown/i);
});

Then(
  "the quote text (and author if present) is copied to the clipboard",
  async function (this: CustomWorld) {
    if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");

    // Clipboard access may require permissions and a secure context.
    // This is a placeholder assertion and should be adapted to AUT implementation.
    const quote = await readCurrentQuote(this);
    expect(quote.text.length).toBeGreaterThan(0);

    // Attempt to read clipboard; if blocked, fail with actionable message.
    try {
      const clipboardText = await this.page.evaluate(async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const nav: any = navigator;
        return nav.clipboard?.readText ? await nav.clipboard.readText() : "";
      });

      expect(clipboardText).toContain(quote.text);
      if (quote.author) {
        expect(clipboardText).toContain(quote.author);
      }
    } catch (e) {
      throw new Error(
        "Clipboard validation failed (likely due to browser permissions/secure context). " +
          "Update this step to validate copy confirmation/toast or to grant clipboard permissions in context. " +
          `Original error: ${String(e)}`
      );
    }
  }
);

Then("I see a confirmation message", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
  await expect(this.page.locator(selectors.toastMessage)).toBeVisible();
});

Then("I can open \"History\"", async function (this: CustomWorld) {
  await clickBySelector(this, selectors.historyButton);
  await expect(this.page!.locator(selectors.historyListItems).first()).toBeVisible();
});

Then(
  "I see the last {int} shown quotes in reverse chronological order",
  async function (this: CustomWorld, count: number) {
    if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");

    const items = this.page.locator(selectors.historyListItems);
    await expect(items).toHaveCount(count);

    // Reverse chronological order is UI-dependent; placeholder check that first item is visible.
    await expect(items.first()).toBeVisible();
  }
);

Then("that quote is displayed in the quote area", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
  await expect(this.page.locator(selectors.quoteArea)).toBeVisible();
  const quote = await readCurrentQuote(this);
  expect(quote.text.length).toBeGreaterThan(0);
});

Then("the quote is added to my Favorites list", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
  await clickBySelector(this, selectors.favoritesButton);
  await expect(this.page.locator(selectors.favoritesListItems).first()).toBeVisible();
});

Then("the quote is removed from my Favorites list", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
  // Placeholder: validate by ensuring list is empty or quote missing.
  // Without knowing how quotes are identified, we only check list count can be 0.
  const items = this.page.locator(selectors.favoritesListItems);
  await expect(items).toHaveCount(0);
});

Then(
  "the displayed quote belongs to category {string}",
  async function (this: CustomWorld, category: string) {
    if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");

    // Placeholder: category may be shown as a label near quote.
    const categoryLabel = this.page.getByText(category, { exact: false });
    await expect(categoryLabel).toBeVisible();
  }
);

Then(
  "the newly displayed quote is different from the previously displayed quote",
  async function (this: CustomWorld) {
    const prev = (this as unknown as { prevQuote?: QuoteSnapshot }).prevQuote;
    if (!prev) throw new Error("Previous quote was not captured.");

    const current = await readCurrentQuote(this);
    expect(current.text).not.toBe(prev.text);
  }
);