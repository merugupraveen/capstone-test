import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Page object for the Random Quote screen.
 *
 * NOTE: Locators are placeholders because AUT URL/DOM is not provided.
 * Replace selectors once the AUT is known (or capture via Playwright MCP against the real app).
 */
export class RandomQuotePage extends BasePage {
  readonly showQuoteButton: Locator;
  readonly quoteArea: Locator;

  constructor(page: Page) {
    super(page);

    // PLACEHOLDER LOCATORS
    this.showQuoteButton = page.getByRole("button", { name: "Show Quote" });
    this.quoteArea = page.locator("[data-testid='quote-area']");
  }

  async open(baseUrl: string): Promise<void> {
    await this.goto(baseUrl);
  }

  async clickShowQuote(): Promise<void> {
    await this.showQuoteButton.click();
  }

  async expectShowQuoteButtonVisible(): Promise<void> {
    await expect(this.showQuoteButton).toBeVisible();
  }

  async expectQuoteAreaVisible(): Promise<void> {
    await expect(this.quoteArea).toBeVisible();
  }

  async getQuoteText(): Promise<string> {
    return (await this.quoteArea.textContent())?.trim() ?? "";
  }

  async expectQuoteReadable(): Promise<void> {
    await expect(this.quoteArea).toBeVisible();
    await expect(this.quoteArea).not.toHaveText("");
  }
}
