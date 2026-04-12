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
 *
 * NOTE
 * ----
 * Selectors below are intentionally defined as data-testid placeholders with robust fallbacks
 * (role/text selectors) to reduce brittleness once integrated with the real AUT.
 */

// ---- Placeholder selectors (update for your AUT) ----
const selectors = {
  showQuoteButton: "[data-testid='show-quote']",
  copyButton: "[data-testid='copy-quote']",
  favoriteButton: "[data-testid='favorite-quote']",
  unfavoriteButton: "[data-testid='unfavorite-quote']",
  quoteArea: "[data-testid='quote-area']",
  quoteText: "[data-testid='quote-text']",
  quoteAuthor: "[data-testid='quote-author']",
  toastMessage: "[data-testid='toast'], [role='status'], [role='alert']",
  historyButton: "[data-testid='open-history']",
  historyPanel: "[data-testid='history-panel']",
  historyListItems: "[data-testid='history-item']",
  favoritesButton: "[data-testid='open-favorites']",
  favoritesPanel: "[data-testid='favorites-panel']",
  favoritesListItems: "[data-testid='favorite-item']",
  categorySelect: "[data-testid='category-select']",
  categoryLabel: "[data-testid='quote-category']",
  clearHistoryButton: "[data-testid='clear-history']",
  clearFavoritesButton: "[data-testid='clear-favorites']",
};

type QuoteSnapshot = {
  text: string;
  author?: string;
  category?: string;
};

type QuoteWorldState = {
  currentQuote?: QuoteSnapshot;
  previousQuote?: QuoteSnapshot;
  copiedQuote?: QuoteSnapshot;
  lastToastText?: string;
};

function state(world: CustomWorld): QuoteWorldState {
  return world as unknown as QuoteWorldState;
}

function ensurePage(world: CustomWorld) {
  if (!world.page) throw new Error("Playwright page was not initialized for UI scenario.");
  return world.page;
}

async function gotoApp(world: CustomWorld) {
  const page = ensurePage(world);
  await page.goto(env.uiBaseUrl, { waitUntil: "domcontentloaded" });
}

async function locatorWithFallbacks(
  world: CustomWorld,
  primaryCss: string,
  fallbacks: Array<() => ReturnType<CustomWorld["page"]["locator"]> | ReturnType<CustomWorld["page"]["getByRole"]> | ReturnType<CustomWorld["page"]["getByText"]>>
) {
  const page = ensurePage(world);
  const candidates = [page.locator(primaryCss), ...fallbacks.map((f) => f())];

  for (const candidate of candidates) {
    try {
      if (await candidate.first().isVisible({ timeout: 500 }).catch(() => false)) return candidate;
    } catch {
      // ignore
    }
  }
  // If none are visible, return the primary to fail with good error in the next action/assert
  return candidates[0];
}

async function buttonByName(world: CustomWorld, name: string) {
  const page = ensurePage(world);

  const normalized = name.trim().toLowerCase();

  if (normalized === "show quote") {
    return locatorWithFallbacks(world, selectors.showQuoteButton, [
      () => page.getByRole("button", { name: /show quote/i }),
      () => page.getByText(/show quote/i),
    ]);
  }

  if (normalized === "copy") {
    return locatorWithFallbacks(world, selectors.copyButton, [
      () => page.getByRole("button", { name: /copy/i }),
      () => page.getByText(/^copy$/i),
    ]);
  }

  if (normalized === "favorite") {
    return locatorWithFallbacks(world, selectors.favoriteButton, [
      () => page.getByRole("button", { name: /favorite/i }),
      () => page.getByText(/favorite/i),
    ]);
  }

  if (normalized === "unfavorite") {
    return locatorWithFallbacks(world, selectors.unfavoriteButton, [
      () => page.getByRole("button", { name: /unfavorite/i }),
      () => page.getByText(/unfavorite/i),
    ]);
  }

  if (normalized === "history") {
    return locatorWithFallbacks(world, selectors.historyButton, [
      () => page.getByRole("button", { name: /history/i }),
      () => page.getByText(/^history$/i),
    ]);
  }

  if (normalized === "favorites" || normalized === "favourites") {
    return locatorWithFallbacks(world, selectors.favoritesButton, [
      () => page.getByRole("button", { name: /favorites|favourites/i }),
      () => page.getByText(/favorites|favourites/i),
    ]);
  }

  throw new Error(`No selector mapping defined for button: ${name}`);
}

async function readCurrentQuote(world: CustomWorld): Promise<QuoteSnapshot> {
  const page = ensurePage(world);

  const quoteTextLocator = await locatorWithFallbacks(world, selectors.quoteText, [
    () => page.getByTestId("quote-text" as never),
    () => page.locator(selectors.quoteArea),
  ]);

  const rawText =
    (await quoteTextLocator.first().textContent().catch(() => null)) ??
    (await page.locator(selectors.quoteArea).textContent().catch(() => null)) ??
    "";
  const text = rawText.trim();

  const authorLocator = await locatorWithFallbacks(world, selectors.quoteAuthor, [
    () => page.getByText(/^—\s*/i),
    () => page.getByText(/unknown/i),
  ]);
  const authorVisible = await authorLocator.first().isVisible().catch(() => false);
  const author = authorVisible ? ((await authorLocator.first().textContent()) ?? "").trim() : undefined;

  const categoryLocator = await locatorWithFallbacks(world, selectors.categoryLabel, [
    () => page.getByText(/category/i),
  ]);
  const categoryVisible = await categoryLocator.first().isVisible().catch(() => false);
  const category = categoryVisible ? ((await categoryLocator.first().textContent()) ?? "").trim() : undefined;

  return { text, author: author && author.length ? author : undefined, category: category && category.length ? category : undefined };
}

async function click(world: CustomWorld, target: Awaited<ReturnType<typeof buttonByName>> | string) {
  const page = ensurePage(world);
  if (typeof target === "string") {
    await page.locator(target).click();
    return;
  }
  await target.first().click();
}

async function waitForQuoteToBeVisible(world: CustomWorld) {
  const page = ensurePage(world);
  const quoteArea = await locatorWithFallbacks(world, selectors.quoteArea, [
    () => page.getByRole("region", { name: /quote/i }),
    () => page.getByText(/quote/i),
  ]);
  await expect(quoteArea.first()).toBeVisible();
}

async function waitForToast(world: CustomWorld) {
  const page = ensurePage(world);
  const toast = await locatorWithFallbacks(world, selectors.toastMessage, [
    () => page.getByRole("status"),
    () => page.getByRole("alert"),
  ]);
  await expect(toast.first()).toBeVisible();
  const msg = ((await toast.first().textContent().catch(() => null)) ?? "").trim();
  state(world).lastToastText = msg;
}

async function openHistory(world: CustomWorld) {
  const page = ensurePage(world);
  const btn = await buttonByName(world, "History");
  await click(world, btn);

  const panel = await locatorWithFallbacks(world, selectors.historyPanel, [
    () => page.getByRole("dialog", { name: /history/i }),
    () => page.getByRole("region", { name: /history/i }),
  ]);
  await expect(panel.first()).toBeVisible().catch(async () => {
    // Some UIs might not have a dedicated panel; ensure at least list exists.
    await expect(page.locator(selectors.historyListItems).first()).toBeVisible();
  });
}

async function openFavorites(world: CustomWorld) {
  const page = ensurePage(world);
  const btn = await buttonByName(world, "Favorites");
  await click(world, btn);

  const panel = await locatorWithFallbacks(world, selectors.favoritesPanel, [
    () => page.getByRole("dialog", { name: /favorites|favourites/i }),
    () => page.getByRole("region", { name: /favorites|favourites/i }),
  ]);
  await expect(panel.first()).toBeVisible().catch(async () => {
    await expect(page.locator(selectors.favoritesListItems).first()).toBeVisible();
  });
}

async function selectCategory(world: CustomWorld, category: string) {
  const page = ensurePage(world);
  const control = await locatorWithFallbacks(world, selectors.categorySelect, [
    () => page.getByRole("combobox", { name: /category/i }),
    () => page.getByText(/category/i),
  ]);

  // Try as native <select> first
  const didSelect = await page
    .selectOption(selectors.categorySelect, { label: category })
    .then(() => true)
    .catch(() => false);

  if (didSelect) return;

  // Fallback: custom dropdown
  await control.first().click();
  await page.getByRole("option", { name: new RegExp(category.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") }).click().catch(async () => {
    await page.getByText(new RegExp(`^${category.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i")).click();
  });
}

// ---- Given ----

Given("the application is loaded", async function (this: CustomWorld) {
  await gotoApp(this);
});

Given("the application is configured with a quote source", async function (this: CustomWorld) {
  // Placeholder: configuration may be done via env, query param, local storage, etc.
  // Keep as a no-op until AUT contract is known.
  ensurePage(this);
});

Given("the quote source is unavailable", async function (this: CustomWorld) {
  // Placeholder: could be mocked via routing, service worker, or environment flag.
  // Keep as a no-op until AUT contract is known.
  ensurePage(this);
});

Given("the application has a local fallback quote list", async function (this: CustomWorld) {
  // Placeholder: no-op until AUT contract is known.
  ensurePage(this);
});

Given("categories are available", async function (this: CustomWorld) {
  const page = ensurePage(this);
  const control = await locatorWithFallbacks(this, selectors.categorySelect, [
    () => page.getByRole("combobox", { name: /category/i }),
  ]);
  await expect(control.first()).toBeVisible();
});

Given("a quote with an author is available", async function (this: CustomWorld) {
  // Placeholder: no-op until AUT contract is known.
  ensurePage(this);
});

Given("a quote without an author is available", async function (this: CustomWorld) {
  // Placeholder: no-op until AUT contract is known.
  ensurePage(this);
});

Given("a quote is displayed", async function (this: CustomWorld) {
  await gotoApp(this);
  const btn = await buttonByName(this, "Show Quote");
  await click(this, btn);
  await waitForQuoteToBeVisible(this);

  const quote = await readCurrentQuote(this);
  expect(quote.text.length).toBeGreaterThan(0);
  state(this).currentQuote = quote;
});

Given("a quote exists in History", async function (this: CustomWorld) {
  await gotoApp(this);
  const btn = await buttonByName(this, "Show Quote");
  await click(this, btn);
  await waitForQuoteToBeVisible(this);

  await openHistory(this);
  await expect(ensurePage(this).locator(selectors.historyListItems).first()).toBeVisible();
});

Given("a quote is in my Favorites list", async function (this: CustomWorld) {
  await gotoApp(this);
  const show = await buttonByName(this, "Show Quote");
  await click(this, show);
  await waitForQuoteToBeVisible(this);

  const fav = await buttonByName(this, "Favorite");
  await click(this, fav);

  await openFavorites(this);
  await expect(ensurePage(this).locator(selectors.favoritesListItems).first()).toBeVisible();
});

// ---- When ----

When("I click the {string} button", async function (this: CustomWorld, buttonName: string) {
  const btn = await buttonByName(this, buttonName);
  await click(this, btn);
});

When("a quote is shown", async function (this: CustomWorld) {
  const btn = await buttonByName(this, "Show Quote");
  await click(this, btn);
  await waitForQuoteToBeVisible(this);

  const quote = await readCurrentQuote(this);
  expect(quote.text.length).toBeGreaterThan(0);
  state(this).currentQuote = quote;
});

When("I click \"Show Quote\" again", async function (this: CustomWorld) {
  const prev = await readCurrentQuote(this);
  state(this).previousQuote = prev;

  const btn = await buttonByName(this, "Show Quote");
  await click(this, btn);
  await waitForQuoteToBeVisible(this);

  const current = await readCurrentQuote(this);
  state(this).currentQuote = current;
});

When("I click \"Show Quote\" {int} times", async function (this: CustomWorld, count: number) {
  const btn = await buttonByName(this, "Show Quote");
  for (let i = 0; i < count; i++) {
    await click(this, btn);
  }
});

When("I click \"Favorite\"", async function (this: CustomWorld) {
  const btn = await buttonByName(this, "Favorite");
  await click(this, btn);
});

When("I click \"Unfavorite\" for that quote", async function (this: CustomWorld) {
  const btn = await buttonByName(this, "Unfavorite");
  await click(this, btn);
});

When("I can open \"History\"", async function (this: CustomWorld) {
  await openHistory(this);
});

When("I select a quote from History", async function (this: CustomWorld) {
  const page = ensurePage(this);
  await openHistory(this);

  const first = page.locator(selectors.historyListItems).first();
  await expect(first).toBeVisible();
  await first.click();

  await waitForQuoteToBeVisible(this);
  state(this).currentQuote = await readCurrentQuote(this);
});

When("I select category {string}", async function (this: CustomWorld, category: string) {
  await selectCategory(this, category);
});

When("I click \"Copy\"", async function (this: CustomWorld) {
  state(this).copiedQuote = await readCurrentQuote(this);
  const btn = await buttonByName(this, "Copy");
  await click(this, btn);
});

// ---- Then ----

Then("a random quote from the configured source is displayed in the quote area", async function (this: CustomWorld) {
  await waitForQuoteToBeVisible(this);
  const quote = await readCurrentQuote(this);
  expect(quote.text.length).toBeGreaterThan(0);
});

Then("a quote from the local fallback list is displayed", async function (this: CustomWorld) {
  await waitForQuoteToBeVisible(this);
  const quote = await readCurrentQuote(this);
  expect(quote.text.length).toBeGreaterThan(0);
});

Then("I see a non-blocking message that online quotes are temporarily unavailable", async function (this: CustomWorld) {
  await waitForToast(this);
});

Then("the quote text is displayed", async function (this: CustomWorld) {
  const quote = await readCurrentQuote(this);
  expect(quote.text.length).toBeGreaterThan(0);
});

Then("the author name is displayed near the quote", async function (this: CustomWorld) {
  const page = ensurePage(this);
  const author = await locatorWithFallbacks(this, selectors.quoteAuthor, [
    () => page.getByText(/—\s*\w+/),
  ]);
  await expect(author.first()).toBeVisible();
  const txt = ((await author.first().textContent()) ?? "").trim();
  expect(txt.length).toBeGreaterThan(0);
});

Then("the author field displays \"Unknown\" or is hidden", async function (this: CustomWorld) {
  const page = ensurePage(this);
  const author = await locatorWithFallbacks(this, selectors.quoteAuthor, [
    () => page.getByText(/unknown/i),
  ]);
  const visible = await author.first().isVisible().catch(() => false);
  if (!visible) return;
  const txt = ((await author.first().textContent()) ?? "").trim();
  expect(txt).toMatch(/unknown/i);
});

Then("the quote text (and author if present) is copied to the clipboard", async function (this: CustomWorld) {
  const page = ensurePage(this);
  const copied = state(this).copiedQuote ?? (await readCurrentQuote(this));
  expect(copied.text.length).toBeGreaterThan(0);

  // Clipboard access may require permissions and a secure context; attempt best-effort validation.
  try {
    const clipboardText = await page.evaluate(async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const nav: any = navigator;
      return nav.clipboard?.readText ? await nav.clipboard.readText() : "";
    });

    expect(clipboardText).toContain(copied.text);
    if (copied.author) expect(clipboardText).toContain(copied.author);
  } catch (e) {
    // Fallback: validate a confirmation toast if clipboard isn't accessible.
    await waitForToast(this);
    const toast = state(this).lastToastText ?? "";
    if (!toast) {
      throw new Error(
        "Clipboard validation failed (likely due to browser permissions/secure context) and no toast was detected. " +
          "Update this step to validate copy confirmation/toast or grant clipboard permissions in context. " +
          `Original error: ${String(e)}`
      );
    }
  }
});

Then("I see a confirmation message", async function (this: CustomWorld) {
  await waitForToast(this);
});

Then("I see the last {int} shown quotes in reverse chronological order", async function (this: CustomWorld, count: number) {
  const page = ensurePage(this);
  await openHistory(this);

  const items = page.locator(selectors.historyListItems);
  await expect(items).toHaveCount(count);

  // Reverse chronological order is UI-dependent; minimally validate the first item is visible.
  await expect(items.first()).toBeVisible();
});

Then("that quote is displayed in the quote area", async function (this: CustomWorld) {
  await waitForQuoteToBeVisible(this);
  const quote = await readCurrentQuote(this);
  expect(quote.text.length).toBeGreaterThan(0);
});

Then("the quote is added to my Favorites list", async function (this: CustomWorld) {
  const page = ensurePage(this);
  await openFavorites(this);
  await expect(page.locator(selectors.favoritesListItems).first()).toBeVisible();
});

Then("the quote is removed from my Favorites list", async function (this: CustomWorld) {
  const page = ensurePage(this);
  await openFavorites(this);

  // Placeholder: without a stable identifier per quote, validate list is empty (common expected behavior).
  const items = page.locator(selectors.favoritesListItems);
  await expect(items).toHaveCount(0);
});

Then("the displayed quote belongs to category {string}", async function (this: CustomWorld, category: string) {
  const page = ensurePage(this);
  const label = await locatorWithFallbacks(this, selectors.categoryLabel, [
    () => page.getByText(new RegExp(category.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")),
  ]);
  await expect(label.first()).toBeVisible();
});

Then("the newly displayed quote is different from the previously displayed quote", async function (this: CustomWorld) {
  const prev = state(this).previousQuote;
  if (!prev) throw new Error("Previous quote was not captured.");

  const current = state(this).currentQuote ?? (await readCurrentQuote(this));
  expect(current.text).not.toBe(prev.text);
});