import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Random Quote page object.
 *
 * IMPORTANT:
 * - Locators are placeholders because AUT markup/labels are not available in this repository.
 * - Replace these with real locators captured via Playwright MCP once the AUT URL is known.
 */
export class RandomQuotePage extends BasePage {
  readonly newQuoteButton: Locator;
  readonly quoteText: Locator;
  readonly quoteAuthor: Locator;

  readonly loadingIndicator: Locator;
  readonly errorMessage: Locator;
  readonly tryAgainButton: Locator;

  readonly copyButton: Locator;
  readonly copyConfirmation: Locator;

  readonly shareButton: Locator;
  readonly shareOptions: Locator;

  readonly categoryFilter: Locator;

  readonly historyPanelButton: Locator;
  readonly historyPanel: Locator;
  readonly historyItems: Locator;

  readonly quoteRegion: Locator;

  constructor(page: Page) {
    super(page);

    // Buttons
    this.newQuoteButton = page.getByRole("button", { name: /new quote|show quote/i });
    this.tryAgainButton = page.getByRole("button", { name: /try again/i });
    this.copyButton = page.getByRole("button", { name: /copy/i });
    this.shareButton = page.getByRole("button", { name: /share/i });
    this.historyPanelButton = page.getByRole("button", { name: /history/i });

    // Quote display (placeholders)
    this.quoteRegion = page.locator('[data-testid="quote-region"], [role="region"][aria-label*="quote" i]');
    this.quoteText = page.locator('[data-testid="quote-text"], .quote-text');
    this.quoteAuthor = page.locator('[data-testid="quote-author"], .quote-author');

    // States
    this.loadingIndicator = page.locator('[data-testid="quote-loading"], .quote-loading, [aria-busy="true"]');
    this.errorMessage = page.locator('[data-testid="quote-error"], .quote-error, [role="alert"]');

    // Utilities
    this.copyConfirmation = page.locator('[data-testid="copy-confirmation"], .copy-confirmation, [role="status"]');

    // Share
    this.shareOptions = page.locator('[data-testid="share-options"], .share-options, [role="dialog"]');

    // Filters
    this.categoryFilter = page.locator('[data-testid="category-filter"], select[name="category"], [role="combobox"][name*="category" i]');

    // History
    this.historyPanel = page.locator('[data-testid="history-panel"], .history-panel, [role="dialog"][aria-label*="history" i]');
    this.historyItems = page.locator('[data-testid="history-item"], .history-item');
  }

  async open(baseUrl: string): Promise<void> {
    // Placeholder. Update to actual route (e.g., `${baseUrl}/random-quote`).
    await this.goto(baseUrl);
  }

  async clickNewQuote(): Promise<void> {
    await this.newQuoteButton.click();
  }

  async getQuoteText(): Promise<string> {
    return (await this.quoteText.textContent())?.trim() ?? "";
  }

  async getQuoteAuthor(): Promise<string> {
    return (await this.quoteAuthor.textContent())?.trim() ?? "";
  }
}
