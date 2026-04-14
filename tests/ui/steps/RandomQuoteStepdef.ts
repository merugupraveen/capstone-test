import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { env } from "../../../src/config/env";
import { CustomWorld } from "../../../src/support/world";
import { RandomQuotePage } from "../../../src/ui/pages/RandomQuotePage";

function getPageObject(world: CustomWorld): RandomQuotePage {
  if (!world.page) {
    throw new Error("Playwright page was not initialized for UI scenario.");
  }
  return new RandomQuotePage(world.page);
}

type StoredQuote = { text: string; author: string };

function getStoredQuotesMap(world: CustomWorld): Map<string, StoredQuote> {
  const w = world as unknown as { storedQuotes?: Map<string, StoredQuote> };
  if (!w.storedQuotes) w.storedQuotes = new Map<string, StoredQuote>();
  return w.storedQuotes;
}

async function readDisplayedQuote(randomQuotePage: RandomQuotePage): Promise<StoredQuote> {
  const text = await randomQuotePage.getQuoteText();
  const author = await randomQuotePage.getQuoteAuthor();
  return { text, author };
}

Given("I open the Random Quote page", async function (this: CustomWorld) {
  const randomQuotePage = getPageObject(this);
  await randomQuotePage.open(env.uiBaseUrl);
});

When("I click the {string} button", async function (this: CustomWorld, buttonName: string) {
  const randomQuotePage = getPageObject(this);

  // Route to known action buttons. Avoid inventing locators.
  if (/new quote|show quote/i.test(buttonName)) {
    await randomQuotePage.newQuoteButton.click();
    return;
  }
  if (/try again/i.test(buttonName)) {
    await randomQuotePage.tryAgainButton.click();
    return;
  }
  if (/copy/i.test(buttonName)) {
    await randomQuotePage.copyButton.click();
    return;
  }
  if (/share/i.test(buttonName)) {
    await randomQuotePage.shareButton.click();
    return;
  }
  if (/history/i.test(buttonName)) {
    await randomQuotePage.historyPanelButton.click();
    return;
  }

  throw new Error(`Unsupported button name in step: ${buttonName}`);
});

Then("I should see a non-empty quote text", async function (this: CustomWorld) {
  const randomQuotePage = getPageObject(this);
  await randomQuotePage.expectVisible(randomQuotePage.quoteText);
  const text = await randomQuotePage.getQuoteText();
  expect(text.length).toBeGreaterThan(0);
});

Then("I should see a non-empty quote author", async function (this: CustomWorld) {
  const randomQuotePage = getPageObject(this);
  await randomQuotePage.expectVisible(randomQuotePage.quoteAuthor);
  const author = await randomQuotePage.getQuoteAuthor();
  expect(author.length).toBeGreaterThan(0);
});

When("I store the displayed quote as {string}", async function (this: CustomWorld, key: string) {
  const randomQuotePage = getPageObject(this);
  const quote = await readDisplayedQuote(randomQuotePage);
  getStoredQuotesMap(this).set(key, quote);
});

Then(
  "the displayed quote should not equal {string}",
  async function (this: CustomWorld, key: string) {
    const randomQuotePage = getPageObject(this);
    const previous = getStoredQuotesMap(this).get(key);
    if (!previous) {
      throw new Error(`No stored quote found for key: ${key}`);
    }

    const current = await readDisplayedQuote(randomQuotePage);
    expect(current.text).not.toEqual(previous.text);
    expect(current.author).not.toEqual(previous.author);
  }
);

Then("I should see the quote loading indicator", async function (this: CustomWorld) {
  const randomQuotePage = getPageObject(this);
  // Placeholder: Will only work once locator is updated.
  await randomQuotePage.expectVisible(randomQuotePage.loadingIndicator);
});

Then("the quote loading indicator should disappear", async function (this: CustomWorld) {
  const randomQuotePage = getPageObject(this);
  // Placeholder: Will only work once locator is updated.
  await expect(randomQuotePage.loadingIndicator).toBeHidden({ timeout: 30_000 });
});

Given("the quote source is unavailable", async function (this: CustomWorld) {
  // Placeholder: requires mocking/intercepting the quote API or stubbing quote provider.
  // Update once endpoints are known.
});

Given("the quote source fails once then succeeds", async function (this: CustomWorld) {
  // Placeholder: requires mocking/intercepting the quote API with first-fail-then-success.
});

Then("I should see a quote load error message", async function (this: CustomWorld) {
  const randomQuotePage = getPageObject(this);
  await randomQuotePage.expectVisible(randomQuotePage.errorMessage);
});

Then("I should see a {string} action", async function (this: CustomWorld, actionName: string) {
  const randomQuotePage = getPageObject(this);
  if (/try again/i.test(actionName)) {
    await randomQuotePage.expectVisible(randomQuotePage.tryAgainButton);
    return;
  }

  throw new Error(`Unsupported action name in step: ${actionName}`);
});

Given("a quote is displayed", async function (this: CustomWorld) {
  const randomQuotePage = getPageObject(this);

  // Best-effort: click New quote if empty. (Will depend on actual initial-load behavior.)
  const existingText = await randomQuotePage.getQuoteText();
  if (!existingText) {
    await randomQuotePage.newQuoteButton.click();
  }

  const text = await randomQuotePage.getQuoteText();
  expect(text.length).toBeGreaterThan(0);
});

Then("the clipboard should contain the displayed quote", async function (this: CustomWorld) {
  const randomQuotePage = getPageObject(this);

  const displayed = await readDisplayedQuote(randomQuotePage);

  // Requires secure context + permissions in Playwright.
  const clipboardText = await this.page!.evaluate(() => navigator.clipboard.readText());

  expect(clipboardText).toContain(displayed.text);
  if (displayed.author) {
    expect(clipboardText).toContain(displayed.author);
  }
});

Then("I should see a copy confirmation message", async function (this: CustomWorld) {
  const randomQuotePage = getPageObject(this);
  await randomQuotePage.expectVisible(randomQuotePage.copyConfirmation);
});

Then("I should see sharing options", async function (this: CustomWorld) {
  const randomQuotePage = getPageObject(this);
  await randomQuotePage.expectVisible(randomQuotePage.shareOptions);
});

Then("the share payload should include the displayed quote", async function (this: CustomWorld) {
  // Placeholder: validating share payload typically requires stubbing navigator.share.
  // Once implementation is known, intercept and assert payload content.
});

Given("categories are available", async function (this: CustomWorld) {
  const randomQuotePage = getPageObject(this);
  await randomQuotePage.expectVisible(randomQuotePage.categoryFilter);
});

When("I select the {string} category filter", async function (this: CustomWorld, category: string) {
  const randomQuotePage = getPageObject(this);

  // Placeholder: category filter may be select/combobox.
  await randomQuotePage.categoryFilter.selectOption({ label: category }).catch(async () => {
    await randomQuotePage.categoryFilter.fill(category);
    await randomQuotePage.categoryFilter.press("Enter");
  });
});

Then(
  "the displayed quote should belong to category {string}",
  async function (this: CustomWorld, category: string) {
    // Placeholder: requires category metadata in UI.
    // Example approach: assert a category label element near the quote.
    const randomQuotePage = getPageObject(this);
    const categoryLabel = this.page!.locator('[data-testid="quote-category"], .quote-category');
    await randomQuotePage.expectVisible(categoryLabel);
    const labelText = (await categoryLabel.textContent())?.trim() ?? "";
    expect(labelText).toMatch(new RegExp(category, "i"));
  }
);

When("I generate 3 quotes", async function (this: CustomWorld) {
  const randomQuotePage = getPageObject(this);

  const quotes: StoredQuote[] = [];
  for (let i = 0; i < 3; i++) {
    await randomQuotePage.newQuoteButton.click();
    quotes.push(await readDisplayedQuote(randomQuotePage));
  }

  (this as unknown as { generatedQuotes?: StoredQuote[] }).generatedQuotes = quotes;
});

When("I open the {string} panel", async function (this: CustomWorld, panelName: string) {
  const randomQuotePage = getPageObject(this);
  if (/history/i.test(panelName)) {
    await randomQuotePage.historyPanelButton.click();
    return;
  }

  throw new Error(`Unsupported panel name: ${panelName}`);
});

Then("I should see the last 3 generated quotes in order", async function (this: CustomWorld) {
  const randomQuotePage = getPageObject(this);

  await randomQuotePage.expectVisible(randomQuotePage.historyPanel);

  const expectedQuotes = (this as unknown as { generatedQuotes?: StoredQuote[] }).generatedQuotes;
  if (!expectedQuotes || expectedQuotes.length !== 3) {
    throw new Error("Expected 3 generated quotes to be stored by step 'I generate 3 quotes'.");
  }

  const itemsText = await randomQuotePage.historyItems.allTextContents();
  expect(itemsText.length).toBeGreaterThanOrEqual(3);

  // Placeholder ordering assumption: oldest -> newest. Adjust once requirement is confirmed.
  expect(itemsText.join("\n")).toContain(expectedQuotes[0].text);
  expect(itemsText.join("\n")).toContain(expectedQuotes[1].text);
  expect(itemsText.join("\n")).toContain(expectedQuotes[2].text);
});

Given("I focus the {string} button", async function (this: CustomWorld, buttonName: string) {
  const randomQuotePage = getPageObject(this);
  if (/new quote|show quote/i.test(buttonName)) {
    await randomQuotePage.newQuoteButton.focus();
    return;
  }
  throw new Error(`Unsupported button name for focus: ${buttonName}`);
});

When("I press {string}", async function (this: CustomWorld, key: string) {
  if (!this.page) {
    throw new Error("Playwright page was not initialized for UI scenario.");
  }
  await this.page.keyboard.press(key);
});

Then("a new quote should be displayed", async function (this: CustomWorld) {
  const randomQuotePage = getPageObject(this);
  const text = await randomQuotePage.getQuoteText();
  expect(text.length).toBeGreaterThan(0);
});

Then("the quote region should be configured as an ARIA live region", async function (this: CustomWorld) {
  const randomQuotePage = getPageObject(this);

  // Placeholder: assert aria-live attribute exists on quote region.
  const ariaLive = await randomQuotePage.quoteRegion.getAttribute("aria-live");
  expect(ariaLive, "Expected quote region to have aria-live attribute").toBeTruthy();
});
