import { Given, Then } from "@cucumber/cucumber";
import { CustomWorld } from "../../../src/support/world";
import { ApiClient } from "../../../src/api/clients/ApiClient";
import { expectStatusCode, expectTruthy } from "../../../src/utils/assertions";
import { createAuthHeaders } from "../../../src/api/auth/authHeaders";
import { env } from "../../../src/config/env";
import { validateSchema } from "../../../src/utils/schemaValidator";
import { postSchema } from "../../../src/api/schemas/postSchema";

Given("I send a GET request to {string}", async function (this: CustomWorld, path: string) {
  if (!this.apiContext) {
    throw new Error("API request context was not initialized for API scenario.");
  }

  const apiClient = new ApiClient(this.apiContext);
  const authHeaders = createAuthHeaders(env.apiAuthToken);
  this.apiResponse = await apiClient.get(path, authHeaders);
});

Then("the response status should be {int}", async function (this: CustomWorld, expectedStatus: number) {
  if (!this.apiResponse) {
    throw new Error("No API response found. Ensure a request step executed first.");
  }

  expectStatusCode(this.apiResponse.status(), expectedStatus);
});

Then("the response should contain id {int}", async function (this: CustomWorld, expectedId: number) {
  if (!this.apiResponse) {
    throw new Error("No API response found. Ensure a request step executed first.");
  }

  const responseBody = (await this.apiResponse.json()) as { id?: number };
  expectTruthy(responseBody);
  expectStatusCode(responseBody.id ?? -1, expectedId);
});

Then("the response should match the post schema", async function (this: CustomWorld) {
  if (!this.apiResponse) {
    throw new Error("No API response found. Ensure a request step executed first.");
  }

  const responseBody = await this.apiResponse.json();
  validateSchema(postSchema, responseBody);
});
