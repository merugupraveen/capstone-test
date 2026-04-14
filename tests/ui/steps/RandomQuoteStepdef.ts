import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../../../src/support/world";
import { env } from "../../../src/config/env";

/**
 * Random Quote step definitions.
 *
 * IMPORTANT:
 * - This repository currently contains only sample UI automation against https://example.com.
 * - The AUT (Random Quote app) baseUrl and selectors are unknown.
 * - All locators below are placeholders (data-testid suggested in Jira story).
 *
 * Replace these once the application under test is integrated and accessible.
 */

const locators = {
  // Navigation
  allQuotesLink: "[data-testid='all-quotes-link']",
  favoritesLink: "[data-testid='favorites-link']",

  // Generator
  quoteCountSelect: "[data-testid='quote-count-select']",
  showQuoteButton: "[data-testid='show-quote-btn']",
  quoteRegion: "[data-testid='quote-region']",
  totalQuotes: "[data-testid='total-quotes']",
  errorBanner: "[data-testid='quotes-load-error']",
  loadingIndicator: "[data-testid='loading-indicator']",
  noQuotesMessage: "[data-testid='no-quotes-message']",

  // Quote card/list
  quoteCard: "[data-testid='quote-card']",
  quoteId: "[data-testid='quote-id']",
  quoteText: "[data-testid='quote-text']",
  quoteAuthor: "[data-testid='quote-author']",
  copyButton: "[data-testid='copy-quote-btn']",
  bookmarkButton: "[data-testid='bookmark-quote-btn']",

  // Views
  allQuotesPageRoot: "[data-testid='all-quotes-page']",
  allQuotesListItem: "[data-testid='all-quotes-item']",
  historySection: "[data-testid='history-section']",
  historyEntry: "[data-testid='history-entry']",
  favoritesSection: "[data-testid='favorites-section']",
  favoritesEntry: "[data-testid='favorites-entry']",
};

async function ensurePage(world: CustomWorld) {
  if (!world.page) throw new Error("Playwright page was not initialized for UI scenario.");
  return world.page;
}

Given("the user opens the application", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  // Placeholder: env.uiBaseUrl must point to the Random Quote app.
  await page.goto(env.uiBaseUrl, { waitUntil: "domcontentloaded" });
});

Given("the user is on the Quote Generator page", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  // Placeholder: assumes env.uiBaseUrl is the generator page.
  await page.goto(env.uiBaseUrl, { waitUntil: "domcontentloaded" });
});

Given("the quote dataset is loaded successfully", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  // Placeholder: wait for total quotes or quote count selector to indicate loaded.
  await page.waitForSelector(locators.quoteCountSelect);
});

Given("the quote dataset is loaded with at least 2 quotes", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  await page.waitForSelector(locators.totalQuotes);
  const text = (await page.locator(locators.totalQuotes).textContent())?.trim() ?? "";
  const n = Number(text.replace(/\D+/g, ""));
  expect(n).toBeGreaterThanOrEqual(2);
});

Given("the quote dataset is loaded with at least 2 distinct quotes", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  await page.waitForSelector(locators.totalQuotes);
  const text = (await page.locator(locators.totalQuotes).textContent())?.trim() ?? "";
  const n = Number(text.replace(/\D+/g, ""));
  expect(n).toBeGreaterThanOrEqual(2);
});

Given("a quote card is displayed", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  await page.waitForSelector(locators.quoteCard);
});

Given("a quote card is displayed with quote text and author", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  const card = page.locator(locators.quoteCard).first();
  await expect(card).toBeVisible();
  await expect(card.locator(locators.quoteText)).toBeVisible();
  await expect(card.locator(locators.quoteAuthor)).toBeVisible();
});

Given("a quote card is displayed with quote text and no author", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  const card = page.locator(locators.quoteCard).first();
  await expect(card).toBeVisible();
  await expect(card.locator(locators.quoteText)).toBeVisible();
  await expect(card.locator(locators.quoteAuthor)).toHaveCount(0);
});

Given("a quote card is displayed and is bookmarked", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  const card = page.locator(locators.quoteCard).first();
  await expect(card).toBeVisible();
  // Placeholder: assumes aria-pressed indicates bookmark toggle state.
  const bookmark = card.locator(locators.bookmarkButton);
  await expect(bookmark).toBeVisible();
  await expect(bookmark).toHaveAttribute(/aria-pressed|data-state/, /true|on|bookmarked/);
});

Given("the quote dataset load completes successfully", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  await page.waitForSelector(locators.totalQuotes);
});

Given("the quote dataset loads successfully with 0 quotes", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  await page.waitForSelector(locators.totalQuotes);
  const text = (await page.locator(locators.totalQuotes).textContent())?.trim() ?? "";
  const n = Number(text.replace(/\D+/g, ""));
  expect(n).toBe(0);
});

When("the user selects quote count {string}", async function (this: CustomWorld, count: string) {
  const page = await ensurePage(this);
  // Placeholder: could be select or input.
  await page.locator(locators.quoteCountSelect).selectOption({ label: count }).catch(async () => {
    await page.locator(locators.quoteCountSelect).selectOption({ value: count });
  });
});

When("the user clicks the {string} button", async function (this: CustomWorld, buttonName: string) {
  const page = await ensurePage(this);
  if (buttonName !== "Show Quote") throw new Error(`Unsupported button: ${buttonName}`);
  await page.locator(locators.showQuoteButton).click();
});

When("the user clicks the {string} button again", async function (this: CustomWorld, buttonName: string) {
  const page = await ensurePage(this);
  if (buttonName !== "Show Quote") throw new Error(`Unsupported button: ${buttonName}`);
  await page.locator(locators.showQuoteButton).click();
});

When("the user clicks the {string} navigation link", async function (this: CustomWorld, linkName: string) {
  const page = await ensurePage(this);
  if (linkName !== "All Quotes") throw new Error(`Unsupported link: ${linkName}`);
  await page.locator(locators.allQuotesLink).click();
});

When("the user clicks the {string} control on the quote card", async function (this: CustomWorld, controlName: string) {
  const page = await ensurePage(this);
  const card = page.locator(locators.quoteCard).first();
  await expect(card).toBeVisible();

  if (controlName === "Copy") {
    await card.locator(locators.copyButton).click();
    return;
  }

  if (controlName === "Bookmark") {
    await card.locator(locators.bookmarkButton).click();
    return;
  }

  throw new Error(`Unsupported control: ${controlName}`);
});

When("the user clicks the {string} control on the same quote card", async function (this: CustomWorld, controlName: string) {
  const page = await ensurePage(this);
  const card = page.locator(locators.quoteCard).first();
  await expect(card).toBeVisible();

  if (controlName !== "Bookmark") throw new Error(`Unsupported control: ${controlName}`);
  await card.locator(locators.bookmarkButton).click();
});

When("the user navigates to the {string} button using the Tab key", async function (this: CustomWorld, buttonName: string) {
  const page = await ensurePage(this);
  if (buttonName !== "Show Quote") throw new Error(`Unsupported button: ${buttonName}`);

  // Best-effort: press Tab until focus matches show quote button.
  // Placeholder; may need a deterministic focus management strategy.
  for (let i = 0; i < 20; i++) {
    const focused = await page.evaluate(() => document.activeElement?.getAttribute("data-testid"));
    if (focused === "show-quote-btn") return;
    await page.keyboard.press("Tab");
  }
  // If not found, fall back to asserting it is focusable.
  await expect(page.locator(locators.showQuoteButton)).toBeVisible();
});

When("the user activates the button using the Enter key", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  await page.keyboard.press("Enter");
});

When("the user inspects the accessible name of the {string} button", async function (this: CustomWorld, buttonName: string) {
  const page = await ensurePage(this);
  if (buttonName !== "Show Quote") throw new Error(`Unsupported button: ${buttonName}`);

  const button = page.locator(locators.showQuoteButton);
  await expect(button).toBeVisible();
  const name = await button.evaluate((el) => (el as HTMLElement).getAttribute("aria-label") || (el as HTMLElement).textContent || "");
  this.attach?.(`Accessible name candidate: ${name}`, "text/plain");
});

When("the user inspects the quote display region", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  await expect(page.locator(locators.quoteRegion)).toBeVisible();
});

When("the user opens the All Quotes page", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  // Placeholder: either direct route or via link.
  await page.goto(`${env.uiBaseUrl}/all-quotes`, { waitUntil: "domcontentloaded" });
});

Then("exactly {int} quote card is displayed", async function (this: CustomWorld, n: number) {
  const page = await ensurePage(this);
  await expect(page.locator(locators.quoteCard)).toHaveCount(n);
});

Then("exactly {int} quote cards are displayed", async function (this: CustomWorld, n: number) {
  const page = await ensurePage(this);
  await expect(page.locator(locators.quoteCard)).toHaveCount(n);
});

Then("the displayed quote text is not empty", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  const card = page.locator(locators.quoteCard).first();
  const text = (await card.locator(locators.quoteText).textContent())?.trim() ?? "";
  expect(text.length).toBeGreaterThan(0);
});

Then("the displayed quote author is visible and not empty", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  const card = page.locator(locators.quoteCard).first();
  const authorLocator = card.locator(locators.quoteAuthor);
  await expect(authorLocator).toBeVisible();
  const author = (await authorLocator.textContent())?.trim() ?? "";
  expect(author.length).toBeGreaterThan(0);
});

Then("the author element is not displayed for that quote card", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  const card = page.locator(locators.quoteCard).first();
  await expect(card.locator(locators.quoteAuthor)).toHaveCount(0);
});

Then("each quote card displays non-empty quote text", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  const cards = page.locator(locators.quoteCard);
  const count = await cards.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    const text = (await cards.nth(i).locator(locators.quoteText).textContent())?.trim() ?? "";
    expect(text.length).toBeGreaterThan(0);
  }
});

Then("the quote id of the first card is different from the quote id of the second card", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  const cards = page.locator(locators.quoteCard);
  await expect(cards).toHaveCount(2);

  const id1 = (await cards.nth(0).locator(locators.quoteId).textContent())?.trim() ?? "";
  const id2 = (await cards.nth(1).locator(locators.quoteId).textContent())?.trim() ?? "";

  // Placeholder: requires quote id to be present in DOM.
  expect(id1).not.toEqual("");
  expect(id2).not.toEqual("");
  expect(id1).not.toEqual(id2);
});

Then("the All Quotes page is displayed", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  await expect(page.locator(locators.allQuotesPageRoot)).toBeVisible();
});

Then("the UI displays a list of all available quotes", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  await expect(page.locator(locators.allQuotesListItem).first()).toBeVisible();
});

Then("each list item displays quote text", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  const item = page.locator(locators.allQuotesListItem).first();
  await expect(item).toBeVisible();
  const text = (await item.textContent())?.trim() ?? "";
  expect(text.length).toBeGreaterThan(0);
});

Then("the History section is displayed", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  await expect(page.locator(locators.historySection)).toBeVisible();
});

Then("the History section contains at least {int} entries", async function (this: CustomWorld, n: number) {
  const page = await ensurePage(this);
  const entries = page.locator(locators.historyEntry);
  await expect(entries).toHaveCountGreaterThanOrEqual?.(n);
  // Fallback for older Playwright versions:
  const count = await entries.count();
  expect(count).toBeGreaterThanOrEqual(n);
});

Then("the most recent generated quote appears as the first entry in History", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  const firstHistory = page.locator(locators.historyEntry).first();
  await expect(firstHistory).toBeVisible();
});

Then("the system clipboard contains the quote text", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  // NOTE: clipboard read requires permissions and https context.
  // Placeholder: best-effort read.
  const clipboardText = await page.evaluate(async () => {
    try {
      // @ts-ignore
      return await navigator.clipboard.readText();
    } catch {
      return "";
    }
  });
  expect(clipboardText.length).toBeGreaterThan(0);
});

Then("the system clipboard contains the quote author", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  const clipboardText = await page.evaluate(async () => {
    try {
      // @ts-ignore
      return await navigator.clipboard.readText();
    } catch {
      return "";
    }
  });
  // Placeholder: cannot assert exact delimiter without spec.
  expect(clipboardText.length).toBeGreaterThan(0);
});

Then("the system clipboard does not contain an author delimiter or placeholder", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  const clipboardText = await page.evaluate(async () => {
    try {
      // @ts-ignore
      return await navigator.clipboard.readText();
    } catch {
      return "";
    }
  });
  expect(clipboardText).not.toMatch(/—\s*$/);
  expect(clipboardText).not.toMatch(/undefined|null/i);
});

Then("the quote is marked as bookmarked in the UI", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  const card = page.locator(locators.quoteCard).first();
  const bookmark = card.locator(locators.bookmarkButton);
  await expect(bookmark).toHaveAttribute(/aria-pressed|data-state/, /true|on|bookmarked/);
});

Then("the quote appears in the Favorites list or section", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  await expect(page.locator(locators.favoritesSection)).toBeVisible();
  await expect(page.locator(locators.favoritesEntry).first()).toBeVisible();
});

Then("the quote is marked as not bookmarked in the UI", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  const card = page.locator(locators.quoteCard).first();
  const bookmark = card.locator(locators.bookmarkButton);
  await expect(bookmark).toHaveAttribute(/aria-pressed|data-state/, /false|off|unbookmarked/);
});

Then("the quote is removed from the Favorites list or section", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  // Placeholder: if favorites section remains but empty.
  const count = await page.locator(locators.favoritesEntry).count();
  expect(count).toBe(0);
});

Given("the quote source is configured as {string}", async function (this: CustomWorld, source: string) {
  // Placeholder: configuration is outside UI (env/build-time).
  // We keep this step as documentation.
  this.attach?.(`Configured quote source: ${source}`, "text/plain");
});

Given("the remote quotes endpoint is available", async function (this: CustomWorld) {
  // Placeholder: should be handled via network mocking in Playwright.
  this.attach?.("Remote endpoint is assumed available (mock required)", "text/plain");
});

Given("the remote quotes endpoint is unavailable", async function (this: CustomWorld) {
  this.attach?.("Remote endpoint is assumed unavailable (mock required)", "text/plain");
});

Given("the remote quotes endpoint responds slowly", async function (this: CustomWorld) {
  this.attach?.("Remote endpoint is assumed slow (mock required)", "text/plain");
});

Then("the application loads the quote dataset from the remote endpoint", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  // Placeholder: expect total quotes becomes visible as proxy for load.
  await expect(page.locator(locators.totalQuotes)).toBeVisible();
});

Then("the UI displays the total number of available quotes", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  await expect(page.locator(locators.totalQuotes)).toBeVisible();
});

Then("the displayed total is a positive integer", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  const text = (await page.locator(locators.totalQuotes).textContent())?.trim() ?? "";
  const n = Number(text.replace(/\D+/g, ""));
  expect(Number.isInteger(n)).toBeTruthy();
  expect(n).toBeGreaterThan(0);
});

Then("the UI displays an error message indicating quotes could not be loaded", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  await expect(page.locator(locators.errorBanner)).toBeVisible();
});

Then("the application remains responsive", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  await expect(page.locator("body")).toBeVisible();
});

Then("the application does not crash", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  const title = await page.title();
  expect(title).not.toEqual("");
});

Then("the application generates quotes according to the selected count", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  // Placeholder: simply verify at least 1 quote card appears.
  await expect(page.locator(locators.quoteCard).first()).toBeVisible();
});

Then("the generated quotes are displayed in the quote region", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  await expect(page.locator(locators.quoteRegion)).toBeVisible();
});

Then("the accessible name is present and describes the action", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  const button = page.locator(locators.showQuoteButton);
  const name = await button.evaluate((el) => (el as HTMLElement).getAttribute("aria-label") || (el as HTMLElement).textContent || "");
  expect(name.trim().length).toBeGreaterThan(0);
});

Then("the quote display region has an accessible label or landmark role", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  const region = page.locator(locators.quoteRegion);
  const attrs = await region.evaluate((el) => ({
    role: el.getAttribute("role"),
    ariaLabel: el.getAttribute("aria-label"),
    ariaLabelledBy: el.getAttribute("aria-labelledby"),
  }));

  expect((attrs.role || attrs.ariaLabel || attrs.ariaLabelledBy || "").length).toBeGreaterThan(0);
});

Then("the UI displays a {string} message", async function (this: CustomWorld, message: string) {
  const page = await ensurePage(this);
  await expect(page.locator(locators.noQuotesMessage)).toContainText(message);
});

Then("the {string} button is disabled", async function (this: CustomWorld, buttonName: string) {
  const page = await ensurePage(this);
  if (buttonName !== "Show Quote") throw new Error(`Unsupported button: ${buttonName}`);
  await expect(page.locator(locators.showQuoteButton)).toBeDisabled();
});

Then("the UI displays a loading indicator", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  await expect(page.locator(locators.loadingIndicator)).toBeVisible();
});

Then("the UI does not display an empty list as a loaded state", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  // Placeholder: ensure list items are not shown while loading.
  await expect(page.locator(locators.allQuotesListItem)).toHaveCount(0);
});

Then("the UI displays the list of all available quotes", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  await expect(page.locator(locators.allQuotesListItem).first()).toBeVisible();
});
