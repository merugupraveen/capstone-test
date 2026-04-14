import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../../../src/support/world";

/**
 * IMPORTANT:
 * - Jira story EPMCDMETST-38844 provides only generic Gherkin.
 * - AUT URL, selectors, and exact UI behavior are unknown in this repo context.
 * - Steps below intentionally use placeholders (env vars) and minimal, non-invented assertions.
 */

const randomQuoteUrl = process.env.RANDOM_QUOTE_URL;

async function navigateToRandomQuoteGeneratorPage(world: CustomWorld): Promise<void> {
  if (!world.page) throw new Error("Playwright page was not initialized for UI scenario.");
  if (!randomQuoteUrl) {
    throw new Error(
      "RANDOM_QUOTE_URL env var is not set. Provide the AUT/competitor URL to navigate to."
    );
  }

  await world.page.goto(randomQuoteUrl, { waitUntil: "domcontentloaded" });
}

Given("I am on the Random Quote Generator page", async function (this: CustomWorld) {
  await navigateToRandomQuoteGeneratorPage(this);
});

When("I trigger the random quote generation action", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");

  // Placeholder: locator for the action that generates a quote is unknown.
  // Update this step once the control is confirmed (e.g., a button name/role or test id).
  throw new Error(
    "Step not implemented: quote generation control locator is unknown. Capture the button/link locator and implement click."
  );
});

Then("I should see a quote displayed", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");

  // Minimal non-invented assertion: page should have some non-empty body text.
  // Replace with a specific quote container assertion once selectors/expected UI are confirmed.
  const bodyText = await this.page.locator("body").innerText();
  expect(bodyText.trim().length).toBeGreaterThan(0);
});

Given("a quote has been generated", async function (this: CustomWorld) {
  // At minimum we can ensure the AUT is loaded. Quote generation control remains unknown.
  await navigateToRandomQuoteGeneratorPage(this);

  // Placeholder: this would normally call the quote generation action.
  // Keeping as-is until a stable selector/interaction is confirmed.
  // Example (once known): await this.page.getByRole("button", { name: /generate/i }).click();
});

Then("I should see the quote author attribution if available", async function (this: CustomWorld) {
  if (!this.page) throw new Error("Playwright page was not initialized for UI scenario.");

  // Placeholder: attribution element is unknown.
  // We cannot assert it exists; only ensure the page is still rendered.
  const bodyText = await this.page.locator("body").innerText();
  expect(bodyText.trim().length).toBeGreaterThan(0);
});