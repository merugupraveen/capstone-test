import { Given, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { env } from "../../../src/config/env";
import { CustomWorld } from "../../../src/support/world";
import { testData } from "../../../src/utils/testData";
import { HomePage } from "../../../src/ui/pages/HomePage";

Given("I open the example home page", async function (this: CustomWorld) {
  if (!this.page) {
    throw new Error("Playwright page was not initialized for UI scenario.");
  }

  const homePage = new HomePage(this.page);
  await homePage.open(env.uiBaseUrl);
});

Then("I should see the expected heading", async function (this: CustomWorld) {
  if (!this.page) {
    throw new Error("Playwright page was not initialized for UI scenario.");
  }

  const homePage = new HomePage(this.page);
  const headingText = await homePage.getHeadingText();
  expect(headingText).toContain(testData.exampleDomainHeading);
});
