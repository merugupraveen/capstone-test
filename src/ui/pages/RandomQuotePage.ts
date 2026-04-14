import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Page Object for Random Quote page.
 *
 * IMPORTANT: This repo does not include the AUT, and the competitor page (Coda) is heavily client-rendered.
 * The locators below are placeholders and MUST be updated once the AUT URL and DOM are known.
 */
export class RandomQuotePage extends BasePage {
  // URL is taken from env.uiBaseUrl by stepdef; if Random Quote is a sub-path, update the stepdef.

  // --- Placeholder locators ---
  // Prefer getByRole / getByLabel once the AUT is known.
  readonly quoteRegion: Locator;
  readonly quoteText: Locator;
  readonly quoteAuthor: Locator;
  readonly generateButton: Locator;
  readonly copyButton: Locator;
  readonly historyButton: Locator;
  readonly historyPanel: Locator;
  readonly historyItems: Locator;
  readonly categorySelect: Locator;
  readonly retryButton: Locator;
  readonly errorMessage: Locator;
  readonly copyConfirmation: Locator;
  readonly loadingIndicator: Locator;

  constructor(page: Page) {
    super(page);

    // Placeholders - update
    this.quoteRegion = page.getByRole("region", { name: "Quote" });
    this.quoteText = page.locator("[data-testid='quote-text']");
    this.quoteAuthor = page.locator("[data-testid='quote-author']");

    this.generateButton = page.getByRole("button", { name: /generate quote/i });
    this.copyButton = page.getByRole("button", { name: /copy/i });
    this.historyButton = page.getByRole("button", { name: /history/i });
    this.historyPanel = page.locator("[data-testid='quote-history']");
    this.historyItems = this.historyPanel.locator("[data-testid='quote-history-item']");

    this.categorySelect = page.locator("select[name='category'], [data-testid='category-select']");

    this.retryButton = page.getByRole("button", { name: /retry/i });
    this.errorMessage = page.locator("[data-testid='error-message']");

    this.copyConfirmation = page.locator("[data-testid='copy-confirmation']");
    this.loadingIndicator = page.locator("[data-testid='quote-loading']");
  }

  async expectQuoteDisplayed(): Promise<void> {
    // Prefer region check if exists; fall back to quote text.
    await Promise.race([
      this.quoteRegion.waitFor({ state: "visible" }),
      this.quoteText.waitFor({ state: "visible" })
    ]);
  }

  async getQuoteText(): Promise<string> {
    const txt = (await this.quoteText.textContent())?.trim();
    if (!txt) {
      // fallback if quote text is in region
      const regionTxt = (await this.quoteRegion.textContent())?.trim() ?? "";
      return regionTxt;
    }
    return txt;
  }

  async getAuthorText(): Promise<string> {
    return (await this.quoteAuthor.textContent())?.trim() ?? "";
  }

  async clickGenerate(): Promise<void> {
    await this.generateButton.click();
  }

  async focusGenerate(): Promise<void> {
    await this.generateButton.focus();
  }

  async clickCopy(): Promise<void> {
    await this.copyButton.click();
  }

  async openHistory(): Promise<void> {
    await this.historyButton.click();
    await this.historyPanel.waitFor({ state: "visible" });
  }

  async selectFirstHistoryItem(): Promise<void> {
    await this.historyItems.first().click();
  }

  async selectCategory(category: string): Promise<void> {
    // Works for native select. If AUT uses custom combobox, update.
    await this.categorySelect.selectOption({ label: category }).catch(async () => {
      // fallback: try value
      await this.categorySelect.selectOption({ value: category });
    });
  }

  async expectLoadingState(): Promise<void> {
    // Placeholder: if no indicator exists, at least ensure button becomes disabled momentarily.
    const hasIndicator = await this.loadingIndicator.count();
    if (hasIndicator) {
      await expect(this.loadingIndicator).toBeVisible();
      return;
    }

    await expect(this.generateButton).toBeDisabled();
  }
}
