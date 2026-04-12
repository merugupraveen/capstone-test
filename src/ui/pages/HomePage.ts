import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
  readonly heading: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.locator("h1");
  }

  async open(baseUrl: string): Promise<void> {
    await this.goto(baseUrl);
  }

  async getHeadingText(): Promise<string> {
    return (await this.heading.textContent())?.trim() ?? "";
  }
}
