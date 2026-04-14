import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { env } from "../../../src/config/env";
import { CustomWorld } from "../../../src/support/world";
import { RandomQuotePage } from "../../../src/ui/pages/RandomQuotePage";

type QuoteSnapshot = { text: string; author: string };

declare module "../../../src/support/world" {
  interface CustomWorld {
    currentQuote?: QuoteSnapshot;
    previousQuote?: QuoteSnapshot;
    selectedHistoryQuoteText?: string;
  }
}

function assertPage(this: CustomWorld): asserts this is CustomWorld & { page: NonNullable<CustomWorld["page"]> } {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");
}

Given("I open the Random Quote page", async function (this: CustomWorld) {
  assertPage.call(this);
  const rq = new RandomQuotePage(this.page);
  await rq.open(env.uiBaseUrl);
  await rq.expectQuoteDisplayed();
});

Then("I should see a quote displayed", async function (this: CustomWorld) {
  assertPage.call(this);
  const rq = new RandomQuotePage(this.page);
  await rq.expectQuoteDisplayed();
});

Then("the quote should have an accessible name {string}", async function (this: CustomWorld, name: string) {
  assertPage.call(this);
  const rq = new RandomQuotePage(this.page);
  // Placeholder: expects a region role named Quote.
  await expect(this.page.getByRole("region", { name })).toBeVisible();
});

Then("I should see the quote author", async function (this: CustomWorld) {
  assertPage.call(this);
  const rq = new RandomQuotePage(this.page);
  const author = await rq.getAuthorText();
  expect(author.length).toBeGreaterThan(0);
});

Given("I capture the current quote", async function (this: CustomWorld) {
  assertPage.call(this);
  const rq = new RandomQuotePage(this.page);
  this.previousQuote = {
    text: await rq.getQuoteText(),
    author: await rq.getAuthorText()
  };
});

When("I click the Generate quote button", async function (this: CustomWorld) {
  assertPage.call(this);
  const rq = new RandomQuotePage(this.page);
  await rq.clickGenerate();
});

Then("I should see the quote loading state", async function (this: CustomWorld) {
  assertPage.call(this);
  const rq = new RandomQuotePage(this.page);
  await rq.expectLoadingState();
});

Then("I should see a new quote displayed", async function (this: CustomWorld) {
  assertPage.call(this);
  const rq = new RandomQuotePage(this.page);
  await rq.expectQuoteDisplayed();

  this.currentQuote = {
    text: await rq.getQuoteText(),
    author: await rq.getAuthorText()
  };

  if (this.previousQuote) {
    // Allow either text or author to change, but not both empty.
    const changed =
      this.currentQuote.text !== this.previousQuote.text ||
      this.currentQuote.author !== this.previousQuote.author;
    expect(changed).toBeTruthy();
  }
});

Given("I focus the Generate quote button", async function (this: CustomWorld) {
  assertPage.call(this);
  const rq = new RandomQuotePage(this.page);
  await rq.focusGenerate();
});

When("I press Enter", async function (this: CustomWorld) {
  assertPage.call(this);
  await this.page.keyboard.press("Enter");
});

Given("a quote is displayed", async function (this: CustomWorld) {
  assertPage.call(this);
  const rq = new RandomQuotePage(this.page);
  await rq.expectQuoteDisplayed();
});

When("I click the Copy button", async function (this: CustomWorld) {
  assertPage.call(this);
  const rq = new RandomQuotePage(this.page);

  // Capture quote before copy for clipboard assertion.
  this.currentQuote = {
    text: await rq.getQuoteText(),
    author: await rq.getAuthorText()
  };

  await rq.clickCopy();
});

Then("the clipboard should contain the current quote and author", async function (this: CustomWorld) {
  assertPage.call(this);
  if (!this.currentQuote) throw new Error("No currentQuote captured before clipboard assertion.");

  // NOTE: Clipboard read can be blocked depending on browser permissions.
  // This is a placeholder assertion; adjust depending on your app and test permissions.
  const clipboardText = await this.page.evaluate(async () => {
    // @ts-expect-error - navigator typing
    return await navigator.clipboard.readText();
  });

  const expected = `${this.currentQuote.text} — ${this.currentQuote.author}`;
  expect(clipboardText).toContain(this.currentQuote.text);
  expect(clipboardText).toContain(this.currentQuote.author);
  // If app formats differently, update this.
  expect(clipboardText).toBe(expected);
});

Then("I should see a copy confirmation message", async function (this: CustomWorld) {
  assertPage.call(this);
  const rq = new RandomQuotePage(this.page);
  // Placeholder: look for test id or generic text.
  const hasLocator = (await rq.copyConfirmation.count()) > 0;
  if (hasLocator) {
    await expect(rq.copyConfirmation).toBeVisible();
  } else {
    await expect(this.page.getByText(/copied/i)).toBeVisible();
  }
});

Given("I have generated {int} quotes", async function (this: CustomWorld, count: number) {
  assertPage.call(this);
  const rq = new RandomQuotePage(this.page);
  for (let i = 0; i < count; i++) {
    await rq.clickGenerate();
    await rq.expectQuoteDisplayed();
  }
});

When("I open the History panel", async function (this: CustomWorld) {
  assertPage.call(this);
  const rq = new RandomQuotePage(this.page);
  await rq.openHistory();
});

Then("I should see at least {int} quotes in History", async function (this: CustomWorld, min: number) {
  assertPage.call(this);
  const rq = new RandomQuotePage(this.page);
  await expect(rq.historyPanel).toBeVisible();
  const itemsCount = await rq.historyItems.count();
  expect(itemsCount).toBeGreaterThanOrEqual(min);
});

When("I select the first quote in History", async function (this: CustomWorld) {
  assertPage.call(this);
  const rq = new RandomQuotePage(this.page);

  // Capture the text of the first history entry for later comparison.
  this.selectedHistoryQuoteText = (await rq.historyItems.first().textContent())?.trim() ?? "";
  await rq.selectFirstHistoryItem();
});

Then("I should see the selected History quote displayed", async function (this: CustomWorld) {
  assertPage.call(this);
  const rq = new RandomQuotePage(this.page);
  await rq.expectQuoteDisplayed();

  if (this.selectedHistoryQuoteText) {
    const displayed = await rq.getQuoteText();
    expect(displayed).toContain(this.selectedHistoryQuoteText);
  }
});

When("I select category {string}", async function (this: CustomWorld, category: string) {
  assertPage.call(this);
  const rq = new RandomQuotePage(this.page);
  await rq.selectCategory(category);
});

Then("I should see a quote displayed for category {string}", async function (this: CustomWorld, category: string) {
  assertPage.call(this);
  // Placeholder: category attribution depends on AUT.
  // If UI shows category label, update this to assert it.
  await expect(this.page.getByText(new RegExp(category, "i"))).toBeVisible();
});

When("the quote generation request fails", async function (this: CustomWorld) {
  assertPage.call(this);

  // Placeholder implementation: intercept an unknown endpoint.
  // Update the URL pattern to match your backend (e.g. /api/quote).
  await this.page.route("**/api/**", async (route) => {
    await route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ message: "error" }) });
  });

  const rq = new RandomQuotePage(this.page);
  await rq.clickGenerate();
});

Then("I should see an error message {string}", async function (this: CustomWorld, message: string) {
  assertPage.call(this);
  const rq = new RandomQuotePage(this.page);
  const hasLocator = (await rq.errorMessage.count()) > 0;
  if (hasLocator) {
    await expect(rq.errorMessage).toContainText(message);
  } else {
    await expect(this.page.getByText(message)).toBeVisible();
  }
});

Then("I should see a Retry button", async function (this: CustomWorld) {
  assertPage.call(this);
  const rq = new RandomQuotePage(this.page);
  await expect(rq.retryButton).toBeVisible();
});
