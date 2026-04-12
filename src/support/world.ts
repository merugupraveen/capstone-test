import { IWorldOptions, World, setWorldConstructor } from "@cucumber/cucumber";
import { APIRequestContext, APIResponse, Browser, BrowserContext, Page, request } from "playwright";

export class CustomWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;
  apiContext?: APIRequestContext;
  apiResponse?: APIResponse;

  constructor(options: IWorldOptions) {
    super(options);
  }

  async createApiContext(baseURL: string): Promise<APIRequestContext> {
    this.apiContext = await request.newContext({ baseURL });
    return this.apiContext;
  }
}

setWorldConstructor(CustomWorld);
