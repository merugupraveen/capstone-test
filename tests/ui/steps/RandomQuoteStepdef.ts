import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { env } from "../../../src/config/env";
import { CustomWorld } from "../../../src/support/world";

/**
 * NOTE:
 * Locators and network routes for the AUT are unknown from the provided Jira content.
 * This step definition file uses placeholders that MUST be replaced with real selectors
 * once the AUT DOM is known (prefer stable data-testid attributes).
 */

const selectors = {
  showQuoteButton: "[data-testid='show-quote']", // TODO: replace
  quoteText: "[data-testid='quote-text']", // TODO: replace
  authorText: "[data-testid='quote-author']", // TODO: replace
  sourceText: "[data-testid='quote-source']", // TODO: replace
  loadingIndicator: "[data-testid='quote-loading']", // TODO: replace
  errorMessage: "[data-testid='quote-error']", // TODO: replace
  infoMessage: "[data-testid='quote-message']", // TODO: replace
  copyButton: "[data-testid='copy-quote']", // TODO: replace
  shareButton: "[data-testid='share-quote']", // TODO: replace
  copyConfirmation: "[data-testid='copy-confirmation']" // TODO: replace
};

type WorldWithVars = CustomWorld & { vars?: Record<string, string> };

function ensurePage(world: CustomWorld) {
  if (!world.page) throw new Error("Playwright page was not initialized for UI scenario.");
  return world.page;
}

Given("I open the application main screen", async function (this: CustomWorld) {
  const page = ensurePage(this);
  await page.goto(env.uiBaseUrl);
});

Then("I should see the {string} button", async function (this: CustomWorld, buttonName: string) {
  const page = ensurePage(this);

  if (buttonName === "Show Quote") {
    await expect(page.locator(selectors.showQuoteButton)).toBeVisible();
    return;
  }
  if (buttonName === "Copy") {
    await expect(page.locator(selectors.copyButton)).toBeVisible();
    return;
  }
  if (buttonName === "Share") {
    await expect(page.locator(selectors.shareButton)).toBeVisible();
    return;
  }

  throw new Error(`Unknown button mapping for: ${buttonName}`);
});

When("I click the {string} button", async function (this: CustomWorld, buttonName: string) {
  const page = ensurePage(this);

  if (buttonName === "Show Quote") {
    await page.locator(selectors.showQuoteButton).click();
    return;
  }
  if (buttonName === "Copy") {
    await page.locator(selectors.copyButton).click();
    return;
  }
  if (buttonName === "Share") {
    await page.locator(selectors.shareButton).click();
    return;
  }

  throw new Error(`Unknown button mapping for: ${buttonName}`);
});

Then("I should see a non-empty quote text", async function (this: CustomWorld) {
  const page = ensurePage(this);
  const quote = page.locator(selectors.quoteText);
  await expect(quote).toBeVisible();
  const text = (await quote.textContent())?.trim() ?? "";
  expect(text.length).toBeGreaterThan(0);
});

Then("I should see a loading indicator", async function (this: CustomWorld) {
  const page = ensurePage(this);
  await expect(page.locator(selectors.loadingIndicator)).toBeVisible();
});

Then("the loading indicator should disappear when the quote is shown", async function (this: CustomWorld) {
  const page = ensurePage(this);
  await expect(page.locator(selectors.loadingIndicator)).toBeHidden();
  await expect(page.locator(selectors.quoteText)).toBeVisible();
});

Given("the quote service is configured to fail", async function (this: CustomWorld) {
  const page = ensurePage(this);

  // TODO: replace with real endpoint. Placeholder route.
  await page.route("**/api/**/quote**", async (route) => {
    await route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ message: "error" }) });
  });
});

Given("the quote service is configured to return no quotes", async function (this: CustomWorld) {
  const page = ensurePage(this);

  // TODO: replace with real endpoint. Placeholder route.
  await page.route("**/api/**/quote**", async (route) => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify([]) });
  });
});

Given("the quote service returns a quote with author", async function (this: CustomWorld) {
  const page = ensurePage(this);

  // TODO: replace with real endpoint + response shape.
  await page.route("**/api/**/quote**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ text: "Test quote", author: "Author A" })
    });
  });
});

Given("the quote service returns a quote with source", async function (this: CustomWorld) {
  const page = ensurePage(this);

  // TODO: replace with real endpoint + response shape.
  await page.route("**/api/**/quote**", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ text: "Test quote", source: "Book/URL" })
    });
  });
});

Then("I should see the error message {string}", async function (this: CustomWorld, message: string) {
  const page = ensurePage(this);
  await expect(page.locator(selectors.errorMessage)).toBeVisible();
  await expect(page.locator(selectors.errorMessage)).toHaveText(message);
});

Then("I should see the message {string}", async function (this: CustomWorld, message: string) {
  const page = ensurePage(this);
  await expect(page.locator(selectors.infoMessage)).toBeVisible();
  await expect(page.locator(selectors.infoMessage)).toHaveText(message);
});

Then("I should see the {string} button enabled", async function (this: CustomWorld, buttonName: string) {
  const page = ensurePage(this);
  if (buttonName !== "Show Quote") throw new Error(`Only Show Quote is supported here, got: ${buttonName}`);
  await expect(page.locator(selectors.showQuoteButton)).toBeEnabled();
});

Then("I should see the author displayed with the quote", async function (this: CustomWorld) {
  const page = ensurePage(this);
  await expect(page.locator(selectors.authorText)).toBeVisible();
  const text = (await page.locator(selectors.authorText).textContent())?.trim() ?? "";
  expect(text.length).toBeGreaterThan(0);
});

Then("I should see the source displayed with the quote", async function (this: CustomWorld) {
  const page = ensurePage(this);
  await expect(page.locator(selectors.sourceText)).toBeVisible();
  const text = (await page.locator(selectors.sourceText).textContent())?.trim() ?? "";
  expect(text.length).toBeGreaterThan(0);
});

When("I capture the displayed quote text as {string}", async function (this: WorldWithVars, varName: string) {
  const page = ensurePage(this);
  const text = ((await page.locator(selectors.quoteText).textContent()) ?? "").trim();
  this.vars = this.vars ?? {};
  this.vars[varName] = text;
});

Then("the displayed quote text should not equal {string}", async function (this: WorldWithVars, varName: string) {
  const page = ensurePage(this);
  const prev = this.vars?.[varName];
  if (!prev) throw new Error(`No stored variable found for ${varName}`);
  const current = ((await page.locator(selectors.quoteText).textContent()) ?? "").trim();
  expect(current).not.toEqual(prev);
});

Then("the clipboard should contain the displayed quote text", async function (this: CustomWorld) {
  const page = ensurePage(this);

  // Clipboard reads require permissions in browser context; might need context grant.
  // This is a best-effort check; adjust based on project clipboard strategy.
  const expected = ((await page.locator(selectors.quoteText).textContent()) ?? "").trim();
  const clipboard = await page.evaluate(async () => await navigator.clipboard.readText());
  expect(clipboard).toEqual(expected);
});

Then("I should see a copy confirmation", async function (this: CustomWorld) {
  const page = ensurePage(this);
  await expect(page.locator(selectors.copyConfirmation)).toBeVisible();
});

Then("the application should invoke the platform share option", async function (this: CustomWorld) {
  const page = ensurePage(this);

  // NOTE: Web Share opens native UI; instead, validate that navigator.share was invoked.
  // We assert by installing a stub before click. If AUT calls navigator.share, it should hit this.
  // If your AUT calls share on click handler, move this stub to a Given step executed before click.
  const invoked = await page.evaluate(() => (window as any).__shareInvoked === true);
  expect(invoked).toBeTruthy();
});

When("I focus the {string} button using keyboard", async function (this: CustomWorld, buttonName: string) {
  const page = ensurePage(this);
  if (buttonName !== "Show Quote") throw new Error(`Only Show Quote is supported here, got: ${buttonName}`);

  await page.locator(selectors.showQuoteButton).focus();
});

When("I press {string}", async function (this: CustomWorld, key: string) {
  const page = ensurePage(this);
  await page.keyboard.press(key);
});

Then("the {string} button should have an accessible name", async function (this: CustomWorld, buttonName: string) {
  const page = ensurePage(this);

  const locator =
    buttonName === "Show Quote"
      ? page.locator(selectors.showQuoteButton)
      : buttonName === "Copy"
        ? page.locator(selectors.copyButton)
        : buttonName === "Share"
          ? page.locator(selectors.shareButton)
          : null;

  if (!locator) throw new Error(`Unknown button mapping for: ${buttonName}`);

  // If the control is a native <button>, innerText counts as accessible name.
  // If custom element, ensure aria-label/aria-labelledby exists.
  const accessibleName = await locator.evaluate((el) => {
    const ariaLabel = el.getAttribute("aria-label");
    const labelledBy = el.getAttribute("aria-labelledby");
    const text = (el.textContent ?? "").trim();
    return ariaLabel || labelledBy || text;
  });

  expect((accessibleName ?? "").toString().trim().length).toBeGreaterThan(0);
});
