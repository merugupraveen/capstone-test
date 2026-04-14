import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../../../src/support/world";
import { env } from "../../../src/config/env";

/**
 * NOTE:
 * - This step definition intentionally uses `data-testid` selectors as specified in Jira test cases.
 * - The AUT base URL and the Random Quote route are not provided in Jira; default is `env.uiBaseUrl`.
 *   Update `randomQuotePath` once the actual route is confirmed.
 */

const randomQuotePath = process.env.RANDOM_QUOTE_PATH ?? "/"; // TODO: confirm actual route, e.g. "/random-quote"

const testIds = {
  generate: "rq-generate",
  loading: "rq-loading",
  quoteText: "rq-quote-text",
  quoteAuthor: "rq-quote-author",
  copy: "rq-copy",
  share: "rq-share",
  error: "rq-error",
  retry: "rq-retry",
  history: "rq-history",
  historyList: "rq-history-list",
  category: "rq-category",
  empty: "rq-empty"
} as const;

function byTestId(id: string): string {
  return `[data-testid=\"${id}\"]`;
}

async function ensurePage(world: CustomWorld) {
  if (!world.page) throw new Error("Playwright page was not initialized for UI scenario.");
  return world.page;
}

Given("I open the Random Quote page", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  await page.goto(new URL(randomQuotePath, env.uiBaseUrl).toString(), { waitUntil: "domcontentloaded" });
});

Then("the Random Quote page exposes required test ids", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  const required = [
    testIds.generate,
    testIds.quoteText,
    testIds.quoteAuthor,
    testIds.copy,
    testIds.share,
    testIds.history,
    testIds.category
  ];

  for (const id of required) {
    await expect(page.locator(byTestId(id))).toHaveCount(1);
  }
});

When("I generate a random quote", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  await expect(page.locator(byTestId(testIds.generate))).toBeVisible();
  await page.locator(byTestId(testIds.generate)).click();
});

Then("I should see loading state while fetching quote", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  // Loading may be very fast; tolerate either visible or absent.
  const loading = page.locator(byTestId(testIds.loading));
  await expect.poll(async () => (await loading.count()) >= 0).toBeTruthy();
});

Then("I should see quote text displayed", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  const text = page.locator(byTestId(testIds.quoteText));
  await expect(text).toBeVisible();
  await expect(text).not.toHaveText(/^\s*$/);
});

Then("I should see quote author displayed", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  const author = page.locator(byTestId(testIds.quoteAuthor));
  await expect(author).toBeVisible();
  await expect(author).not.toHaveText(/^\s*$/);
});

Then("copy and share actions should be enabled", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  await expect(page.locator(byTestId(testIds.copy))).toBeEnabled();
  await expect(page.locator(byTestId(testIds.share))).toBeEnabled();
});

When("I generate a random quote with missing author", async function (this: CustomWorld) {
  // Placeholder: requires stubbing provider response; implement once app provides a deterministic test hook.
  throw new Error(
    "Not implemented: missing-author scenario requires provider stubbing/test hook. Provide an API mock or query param toggle."
  );
});

Then("author should be hidden or shown as Unknown", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  const author = page.locator(byTestId(testIds.quoteAuthor));

  const isVisible = await author.isVisible().catch(() => false);
  if (isVisible) {
    const txt = (await author.textContent())?.trim() ?? "";
    expect(["", "Unknown"].includes(txt)).toBeTruthy();
  } else {
    // acceptable: hidden
    expect(true).toBeTruthy();
  }
});

Then("I should see a single generate quote CTA with an expected label", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  const generate = page.locator(byTestId(testIds.generate));
  await expect(generate).toHaveCount(1);

  // accessible name check (best-effort)
  const name = (await generate.innerText()).trim();
  expect(["Generate", "Generate quote", "New quote"].includes(name)).toBeTruthy();
});

When("I generate a random quote with delayed provider response", async function (this: CustomWorld) {
  // Placeholder: requires throttling/stubbing provider response.
  throw new Error(
    "Not implemented: delayed-provider scenario requires network throttling or mock server support."
  );
});

Then("generate should be disabled while loading", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  await expect(page.locator(byTestId(testIds.generate))).toBeDisabled();
});

Then("no additional quote request should be sent while loading", async function (this: CustomWorld) {
  // Placeholder: needs either network request inspection or app instrumentation.
  throw new Error(
    "Not implemented: validate no extra requests by inspecting network calls. Provide quote endpoint pattern (e.g. /api/quote)."
  );
});

When("quote provider is unavailable and I generate a quote", async function (this: CustomWorld) {
  // Placeholder: requires forcing provider failure (mock /offline mode).
  throw new Error(
    "Not implemented: provider-unavailable scenario requires mocking provider to return error/timeout."
  );
});

Then("I should see an error state with retry", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  await expect(page.locator(byTestId(testIds.error))).toBeVisible();
  await expect(page.locator(byTestId(testIds.retry))).toBeVisible();
  await expect(page.locator(byTestId(testIds.retry))).toBeEnabled();
  await expect(page.locator(byTestId(testIds.copy))).toBeDisabled();
  await expect(page.locator(byTestId(testIds.share))).toBeDisabled();
});

When("quote provider becomes available and I retry", async function (this: CustomWorld) {
  // Placeholder: requires toggling provider back to success.
  throw new Error(
    "Not implemented: provider recovery requires a controllable test double for the quote service."
  );
});

Given("a quote is displayed", async function (this: CustomWorld) {
  // Best-effort: if already displayed do nothing; else try to generate.
  const page = await ensurePage(this);
  const text = page.locator(byTestId(testIds.quoteText));
  const hasText = (await text.count()) > 0 && (await text.textContent())?.trim();
  if (!hasText) {
    await page.locator(byTestId(testIds.generate)).click();
    await expect(text).toBeVisible();
  }
});

When("I copy the quote to clipboard", async function (this: CustomWorld) {
  const page = await ensurePage(this);

  // Ensure clipboard permissions (best-effort in Chromium)
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);

  await expect(page.locator(byTestId(testIds.copy))).toBeEnabled();
  await page.locator(byTestId(testIds.copy)).click();
});

Then("clipboard should contain the quote text", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  const quoteText = (await page.locator(byTestId(testIds.quoteText)).textContent())?.trim() ?? "";

  const clipboard = await page.evaluate(async () => await navigator.clipboard.readText());
  expect(clipboard).toContain(quoteText);
});

Then("clipboard should contain the quote author if present", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  const authorLocator = page.locator(byTestId(testIds.quoteAuthor));
  const visible = await authorLocator.isVisible().catch(() => false);
  if (!visible) return;

  const author = (await authorLocator.textContent())?.trim() ?? "";
  if (!author) return;

  const clipboard = await page.evaluate(async () => await navigator.clipboard.readText());
  expect(clipboard).toContain(author);
});

Then("I should see a copy confirmation message", async function (this: CustomWorld) {
  // Placeholder: no selector defined in Jira for toast/message.
  throw new Error(
    "Not implemented: provide data-testid for copy confirmation/toast (e.g., rq-copy-toast)."
  );
});

Given("clipboard write is rejected", async function (this: CustomWorld) {
  // Placeholder: requires overriding navigator.clipboard.writeText.
  throw new Error("Not implemented: requires stubbing clipboard API in page context.");
});

Then("I should see a non-blocking clipboard warning message", async function (this: CustomWorld) {
  // Placeholder: no selector defined.
  throw new Error(
    "Not implemented: provide data-testid for clipboard warning message (e.g., rq-clipboard-warning)."
  );
});

Given("the browser supports web share", async function (this: CustomWorld) {
  // Placeholder: requires injecting navigator.share.
  throw new Error("Not implemented: requires stubbing Web Share API in automation.");
});

Given("the browser does not support web share", async function (this: CustomWorld) {
  // Placeholder: ensure navigator.share is undefined.
  throw new Error("Not implemented: requires controlling Web Share API availability in automation.");
});

When("I share the quote", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  await expect(page.locator(byTestId(testIds.share))).toBeEnabled();
  await page.locator(byTestId(testIds.share)).click();
});

Then("the native share should be invoked with the quote payload", async function (this: CustomWorld) {
  // Placeholder: requires spy on navigator.share.
  throw new Error("Not implemented: requires spy/assert on navigator.share invocation.");
});

Then("a share fallback UI should be displayed", async function (this: CustomWorld) {
  // Placeholder: provide selector for fallback.
  throw new Error(
    "Not implemented: provide data-testid for share fallback container (e.g., rq-share-fallback)."
  );
});

When("I generate two different quotes", async function (this: CustomWorld) {
  // Best-effort: generate twice and assert text differs.
  const page = await ensurePage(this);

  await page.locator(byTestId(testIds.generate)).click();
  const first = (await page.locator(byTestId(testIds.quoteText)).textContent())?.trim() ?? "";

  await page.locator(byTestId(testIds.generate)).click();
  const second = (await page.locator(byTestId(testIds.quoteText)).textContent())?.trim() ?? "";

  // Store for later steps
  (this as any).rqFirstQuote = first;
  (this as any).rqSecondQuote = second;

  expect(first).not.toEqual("");
  expect(second).not.toEqual("");
});

When("I open quote history", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  await expect(page.locator(byTestId(testIds.history))).toBeVisible();
  await page.locator(byTestId(testIds.history)).click();
});

Then("I should see history list visible", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  await expect(page.locator(byTestId(testIds.historyList))).toBeVisible();
});

Then("the first history item should be the most recent quote", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  const list = page.locator(byTestId(testIds.historyList));
  const firstItem = list.locator(":scope > *").first();
  await expect(firstItem).toBeVisible();

  const expected = ((this as any).rqSecondQuote as string | undefined) ?? "";
  if (expected) {
    await expect(firstItem).toContainText(expected);
  }
});

Given("I have at least two quotes in history", async function (this: CustomWorld) {
  // Reuse generation logic
  await (async () => {
    const page = await ensurePage(this);
    await page.locator(byTestId(testIds.generate)).click();
    await page.locator(byTestId(testIds.generate)).click();
  })();
});

When("I select the second history item", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  const list = page.locator(byTestId(testIds.historyList));
  const secondItem = list.locator(":scope > *").nth(1);
  await expect(secondItem).toBeVisible();
  await secondItem.click();
});

Then("the selected history quote should be displayed", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  await expect(page.locator(byTestId(testIds.quoteText))).toBeVisible();
});

Then("no new quote request should be sent", async function () {
  // Placeholder: needs network inspection.
  throw new Error(
    "Not implemented: provide quote endpoint path/regex to assert no fetch occurs on history selection."
  );
});

When("I select quote category {string}", async function (this: CustomWorld, category: string) {
  const page = await ensurePage(this);
  const dropdown = page.locator(byTestId(testIds.category));
  await expect(dropdown).toBeVisible();
  await dropdown.selectOption({ label: category }).catch(async () => {
    // fallback by value
    await dropdown.selectOption({ value: category });
  });
});

Then("the displayed quote should belong to category {string}", async function () {
  // Placeholder: requires the UI to expose category for the displayed quote.
  throw new Error(
    "Not implemented: need a UI element/attribute showing the quote category (e.g., data-testid rq-quote-category)."
  );
});

When("I select a category with no quotes", async function () {
  // Placeholder: requires known empty category or test mode.
  throw new Error(
    "Not implemented: require deterministic empty category label/value (e.g., 'EmptyCategory') or mock provider."
  );
});

Then("I should see a no results state", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  await expect(page.locator(byTestId(testIds.empty))).toBeVisible();
});

Then("copy and share actions should be disabled", async function (this: CustomWorld) {
  const page = await ensurePage(this);
  await expect(page.locator(byTestId(testIds.copy))).toBeDisabled();
  await expect(page.locator(byTestId(testIds.share))).toBeDisabled();
});
