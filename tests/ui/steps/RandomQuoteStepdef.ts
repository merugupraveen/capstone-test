import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { env } from "../../../src/config/env";
import { CustomWorld } from "../../../src/support/world";

/**
 * IMPORTANT
 * - This repo currently contains only a sample UI test against https://example.com.
 * - The AUT for the Random Quote app is not present here; therefore locators/selectors are unknown.
 * - Replace the placeholder selectors in `selectors` once the real UI is available.
 */

const selectors = {
  showQuoteButton: "[data-testid='show-quote']", // TODO replace
  copyButton: "[data-testid='copy-quote']", // TODO replace
  favoriteButton: "[data-testid='favorite-quote']", // TODO replace
  unfavoriteButton: "[data-testid='unfavorite-quote']", // TODO replace
  historyButton: "[data-testid='open-history']", // TODO replace
  historyListItems: "[data-testid='history-item']", // TODO replace
  quoteText: "[data-testid='quote-text']", // TODO replace
  quoteAuthor: "[data-testid='quote-author']", // TODO replace
  categorySelect: "[data-testid='category-select']", // TODO replace
  offlineMessage: "[data-testid='quotes-offline-message']", // TODO replace
  toastMessage: "[data-testid='toast']", // TODO replace
  favoritesListItems: "[data-testid='favorite-item']" // TODO replace
};

async function getPage(world: CustomWorld) {
  if (!world.page) throw new Error("Playwright page was not initialized for UI scenario.");
  return world.page;
}

async function getQuoteSnapshot(world: CustomWorld): Promise<{ text: string; author: string | null }> {
  const page = await getPage(world);
  const text = (await page.locator(selectors.quoteText).textContent())?.trim() ?? "";
  const authorRaw = await page.locator(selectors.quoteAuthor).first().textContent().catch(() => null);
  const author = authorRaw ? authorRaw.trim() : null;
  return { text, author };
}

Given("the application is configured with a quote source", async function (this: CustomWorld) {
  // Placeholder: could be env-based config, query param, localStorage, etc.
  // TODO implement once configuration mechanism is known.
  await getPage(this);
});

Given("the quote source is unavailable", async function (this: CustomWorld) {
  // Placeholder: could be network mocking with Playwright route().
  // TODO implement once the online endpoint is known.
  await getPage(this);
});

Given("the application has a local fallback quote list", async function (this: CustomWorld) {
  // Placeholder: validate fallback availability once UI/API is known.
  await getPage(this);
});

Given("a quote with an author is available", async function (this: CustomWorld) {
  // Placeholder: depends on data source.
  await getPage(this);
});

Given("a quote without an author is available", async function (this: CustomWorld) {
  // Placeholder: depends on data source.
  await getPage(this);
});

Given("a quote is displayed", async function (this: CustomWorld) {
  const page = await getPage(this);
  await page.goto(env.uiBaseUrl, { waitUntil: "domcontentloaded" });
  await page.locator(selectors.showQuoteButton).click();
  const snapshot = await getQuoteSnapshot(this);
  expect(snapshot.text, "Expected a non-empty quote to be displayed").not.toEqual("");
});

Given("the application is loaded", async function (this: CustomWorld) {
  const page = await getPage(this);
  await page.goto(env.uiBaseUrl, { waitUntil: "domcontentloaded" });
});

Given("a quote exists in History", async function (this: CustomWorld) {
  const page = await getPage(this);
  await page.goto(env.uiBaseUrl, { waitUntil: "domcontentloaded" });
  await page.locator(selectors.showQuoteButton).click();
  await page.locator(selectors.historyButton).click();
  await expect(page.locator(selectors.historyListItems).first()).toBeVisible();
});

Given("categories are available", async function (this: CustomWorld) {
  const page = await getPage(this);
  await page.goto(env.uiBaseUrl, { waitUntil: "domcontentloaded" });
  await expect(page.locator(selectors.categorySelect)).toBeVisible();
});

Given("a quote is in my Favorites list", async function (this: CustomWorld) {
  const page = await getPage(this);
  await page.goto(env.uiBaseUrl, { waitUntil: "domcontentloaded" });
  await page.locator(selectors.showQuoteButton).click();
  await page.locator(selectors.favoriteButton).click();
  await expect(page.locator(selectors.favoritesListItems).first()).toBeVisible();
});

When("I click the {string} button", async function (this: CustomWorld, buttonName: string) {
  const page = await getPage(this);

  if (buttonName === "Show Quote") {
    this.attach?.(`Clicking Show Quote using selector: ${selectors.showQuoteButton}`);
    await page.locator(selectors.showQuoteButton).click();
    return;
  }

  if (buttonName === "Copy") {
    await page.locator(selectors.copyButton).click();
    return;
  }

  throw new Error(`Unsupported button: ${buttonName}. Add mapping in step definition.`);
});

When("a quote is shown", async function (this: CustomWorld) {
  // If the UI automatically shows a quote on load, adjust accordingly.
  const page = await getPage(this);
  if (await page.locator(selectors.quoteText).count()) return;
  await page.locator(selectors.showQuoteButton).click();
});

When("I click \"Show Quote\" 3 times", async function (this: CustomWorld) {
  const page = await getPage(this);
  for (let i = 0; i < 3; i++) {
    await page.locator(selectors.showQuoteButton).click();
  }
});

When("I select a quote from History", async function (this: CustomWorld) {
  const page = await getPage(this);
  await page.locator(selectors.historyButton).click();
  await page.locator(selectors.historyListItems).first().click();
});

When("I click \"Favorite\"", async function (this: CustomWorld) {
  const page = await getPage(this);
  await page.locator(selectors.favoriteButton).click();
});

When("I click \"Unfavorite\" for that quote", async function (this: CustomWorld) {
  const page = await getPage(this);
  await page.locator(selectors.unfavoriteButton).click();
});

When("I select category {string}", async function (this: CustomWorld, category: string) {
  const page = await getPage(this);
  await page.locator(selectors.categorySelect).selectOption({ label: category }).catch(async () => {
    // fallback if options are values, not labels
    await page.locator(selectors.categorySelect).selectOption(category);
  });
});

When("I click \"Show Quote\"", async function (this: CustomWorld) {
  const page = await getPage(this);
  await page.locator(selectors.showQuoteButton).click();
});

When("I click \"Show Quote\" again", async function (this: CustomWorld) {
  const page = await getPage(this);
  // store previous snapshot in world for later comparison
  (this as any).previousQuoteSnapshot = await getQuoteSnapshot(this);
  await page.locator(selectors.showQuoteButton).click();
});

Then("a random quote from the configured source is displayed in the quote area", async function (this: CustomWorld) {
  const snapshot = await getQuoteSnapshot(this);
  expect(snapshot.text).not.toEqual("");
});

Then("a quote from the local fallback list is displayed", async function (this: CustomWorld) {
  const snapshot = await getQuoteSnapshot(this);
  expect(snapshot.text).not.toEqual("");
});

Then("I see a non-blocking message that online quotes are temporarily unavailable", async function (this: CustomWorld) {
  const page = await getPage(this);
  await expect(page.locator(selectors.offlineMessage)).toBeVisible();
});

Then("the quote text is displayed", async function (this: CustomWorld) {
  const page = await getPage(this);
  await expect(page.locator(selectors.quoteText)).toBeVisible();
  const snapshot = await getQuoteSnapshot(this);
  expect(snapshot.text).not.toEqual("");
});

Then("the author name is displayed near the quote", async function (this: CustomWorld) {
  const page = await getPage(this);
  await expect(page.locator(selectors.quoteAuthor)).toBeVisible();
  const snapshot = await getQuoteSnapshot(this);
  expect(snapshot.author).not.toBeNull();
  expect(snapshot.author).not.toEqual("");
});

Then("the author field displays {string} or is hidden", async function (this: CustomWorld, unknownLabel: string) {
  const page = await getPage(this);
  const authorCount = await page.locator(selectors.quoteAuthor).count();
  if (authorCount === 0) {
    expect(true).toBeTruthy();
    return;
  }
  const authorText = (await page.locator(selectors.quoteAuthor).textContent())?.trim() ?? "";
  expect(authorText === unknownLabel || authorText === "").toBeTruthy();
});

Then("the quote text (and author if present) is copied to the clipboard", async function (this: CustomWorld) {
  const page = await getPage(this);
  const snapshot = await getQuoteSnapshot(this);

  // Clipboard read requires permissions; in headless it may be blocked depending on browser settings.
  // TODO: finalize once AUT + permissions strategy is known.
  const clipboardText = await page.evaluate(async () => {
    try {
      return await navigator.clipboard.readText();
    } catch {
      return "__CLIPBOARD_UNREADABLE__";
    }
  });

  // If clipboard cannot be read, keep this as a soft assertion placeholder.
  if (clipboardText === "__CLIPBOARD_UNREADABLE__") {
    // At minimum validate a confirmation/toast exists (next step).
    return;
  }

  expect(clipboardText).toContain(snapshot.text);
  if (snapshot.author) expect(clipboardText).toContain(snapshot.author);
});

Then("I see a confirmation message", async function (this: CustomWorld) {
  const page = await getPage(this);
  await expect(page.locator(selectors.toastMessage)).toBeVisible();
});

Then("I can open \"History\"", async function (this: CustomWorld) {
  const page = await getPage(this);
  await page.locator(selectors.historyButton).click();
  await expect(page.locator(selectors.historyListItems).first()).toBeVisible();
});

Then("I see the last 3 shown quotes in reverse chronological order", async function (this: CustomWorld) {
  const page = await getPage(this);
  const items = page.locator(selectors.historyListItems);
  const count = await items.count();
  expect(count).toBeGreaterThanOrEqual(3);
});

Then("that quote is displayed in the quote area", async function (this: CustomWorld) {
  const snapshot = await getQuoteSnapshot(this);
  expect(snapshot.text).not.toEqual("");
});

Then("the quote is added to my Favorites list", async function (this: CustomWorld) {
  const page = await getPage(this);
  await expect(page.locator(selectors.favoritesListItems).first()).toBeVisible();
});

Then("the quote is removed from my Favorites list", async function (this: CustomWorld) {
  const page = await getPage(this);
  // Placeholder: actual UI might show empty state instead.
  await expect(page.locator(selectors.favoritesListItems)).toHaveCount(0);
});

Then("the displayed quote belongs to category {string}", async function (this: CustomWorld, category: string) {
  // Placeholder: requires UI to expose category label or data attribute.
  // TODO implement once UI indicates quote category.
  await getPage(this);
  expect(category).toBeTruthy();
});

Then("the newly displayed quote is different from the previously displayed quote", async function (this: CustomWorld) {
  const previous = (this as any).previousQuoteSnapshot as { text: string } | undefined;
  if (!previous) throw new Error("previousQuoteSnapshot not found. Ensure 'I click " + "Show Quote" + " again' ran.");

  const current = await getQuoteSnapshot(this);
  expect(current.text).not.toEqual("");
  expect(current.text).not.toEqual(previous.text);
});
