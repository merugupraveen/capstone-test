import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { env } from "../../../src/config/env";
import { CustomWorld } from "../../../src/support/world";
import { RandomQuotePage } from "../../../src/ui/pages/RandomQuotePage";

Given("I open the application", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");

  const randomQuotePage = new RandomQuotePage(this.page);
  await randomQuotePage.open(env.uiBaseUrl);
});

Then("I should see a button labeled {string}", async function (this: CustomWorld, label: string) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");

  // Keep step generic to avoid hard-coding to the page object locator.
  await expect(this.page.getByRole("button", { name: label })).toBeVisible();
});

Then("I should see an area dedicated to displaying a quote", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");

  const randomQuotePage = new RandomQuotePage(this.page);
  await randomQuotePage.expectQuoteAreaVisible();
});

Then("I should see either no quote or a default quote displayed", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");

  const randomQuotePage = new RandomQuotePage(this.page);
  // Acceptance criteria allows either empty or default quote; we can only assert area exists.
  await randomQuotePage.expectQuoteAreaVisible();
});

When("I click the {string} button", async function (this: CustomWorld, label: string) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");

  await this.page.getByRole("button", { name: label }).click();
});

Then(
  "a random quote from the hardcoded list should be displayed in the quote area",
  async function (this: CustomWorld) {
    if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");

    const randomQuotePage = new RandomQuotePage(this.page);
    await randomQuotePage.expectQuoteReadable();
  }
);

Given("a quote is currently displayed", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");

  const randomQuotePage = new RandomQuotePage(this.page);
  await randomQuotePage.expectQuoteAreaVisible();

  // Ensure at least one quote is displayed by clicking the button once.
  await randomQuotePage.clickShowQuote();
  await randomQuotePage.expectQuoteReadable();
});

Then("the displayed quote should update to a new random quote", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");

  const randomQuotePage = new RandomQuotePage(this.page);
  const previous = await randomQuotePage.getQuoteText();

  // Trigger update
  await randomQuotePage.clickShowQuote();

  const updated = await randomQuotePage.getQuoteText();
  expect(updated).not.toEqual("");

  // If dataset has >1 quotes, it should change; otherwise allow equal.
  if (previous !== "") {
    expect(updated).not.toEqual(previous);
  }
});

Then("the new quote should not be the same as the previously displayed quote", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");

  const randomQuotePage = new RandomQuotePage(this.page);
  const previous = await randomQuotePage.getQuoteText();
  await randomQuotePage.clickShowQuote();
  const updated = await randomQuotePage.getQuoteText();

  // Optional requirement. If list has 1 item, repetition is unavoidable.
  if (previous !== "") {
    expect(updated).not.toEqual(previous);
  }
});

Given("a quote is displayed", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");

  const randomQuotePage = new RandomQuotePage(this.page);
  await randomQuotePage.clickShowQuote();
  await randomQuotePage.expectQuoteReadable();
});

Then("the quote should be clearly readable", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");

  const randomQuotePage = new RandomQuotePage(this.page);
  await randomQuotePage.expectQuoteReadable();
});

Given("I am using a desktop or mobile device", async function () {
  // Placeholder: device emulation would be configured via Playwright context.
});

Then("the button and quote area should be accessible and usable", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");

  const randomQuotePage = new RandomQuotePage(this.page);
  await randomQuotePage.expectShowQuoteButtonVisible();
  await randomQuotePage.expectQuoteAreaVisible();
});
