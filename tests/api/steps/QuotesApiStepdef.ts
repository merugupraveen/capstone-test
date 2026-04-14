import { Given, Then } from "@cucumber/cucumber";
import { CustomWorld } from "../../../src/support/world";
import { ApiClient } from "../../../src/api/clients/ApiClient";
import { createAuthHeaders } from "../../../src/api/auth/authHeaders";
import { env } from "../../../src/config/env";
import { expectStatusCode, expectTruthy } from "../../../src/utils/assertions";

/**
 * IMPORTANT:
 * These steps are intentionally generic because the Quotes API contract/endpoints
 * were not provided in the jira_tests (placeholders exist in the feature file).
 *
 * Once real endpoints and response schema are known, add a dedicated JSON schema
 * under src/api/schemas and validate it like the sample postSchema.
 */

Given("I have triggered quote generation until rate limited", async function (this: CustomWorld) {
  if (!this.apiContext) {
    throw new Error("API request context was not initialized for API scenario.");
  }

  // Placeholder behavior: cannot safely brute-force without knowing the endpoint.
  // Replace by looping on the real random-quote endpoint until 429.
  throw new Error(
    "Step not implemented: need the real random quote endpoint to trigger 429. Update QuotesApiTest.feature placeholders and implement here."
  );
});

Then("the response should include quote fields", async function (this: CustomWorld) {
  if (!this.apiResponse) {
    throw new Error("No API response found. Ensure a request step executed first.");
  }

  const body = (await this.apiResponse.json()) as Record<string, unknown>;
  expectTruthy(body);

  // Minimal contract placeholders
  // Replace keys once API spec is known.
  const hasText = Object.prototype.hasOwnProperty.call(body, "text") || Object.prototype.hasOwnProperty.call(body, "quote");
  const hasAuthor = Object.prototype.hasOwnProperty.call(body, "author");
  expectTruthy(hasText);
  expectTruthy(hasAuthor);
});

Then("the quote should belong to category {string}", async function (this: CustomWorld, category: string) {
  if (!this.apiResponse) {
    throw new Error("No API response found. Ensure a request step executed first.");
  }

  const body = (await this.apiResponse.json()) as Record<string, unknown>;
  const candidate = (body["category"] ?? body["tag"] ?? body["tags"]) as unknown;

  // Placeholder assertion: supports { category: string } or { tags: string[] }
  if (typeof candidate === "string") {
    expectTruthy(candidate.toLowerCase().includes(category.toLowerCase()));
    return;
  }

  if (Array.isArray(candidate)) {
    const tags = candidate.map((x) => String(x).toLowerCase());
    expectTruthy(tags.includes(category.toLowerCase()));
    return;
  }

  throw new Error(
    "Cannot determine category field from response. Update this assertion once the Quotes API response contract is known."
  );
});

// Reuse existing generic GET step and status assertion from tests/api/steps/api.steps.ts.
// This file only contains additional quotes-specific assertions.
