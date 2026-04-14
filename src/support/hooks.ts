import { After, Before, BeforeAll, AfterAll, setDefaultTimeout } from "@cucumber/cucumber";
import { Browser, chromium } from "playwright";
import { env } from "../config/env";
import { CustomWorld } from "./world";

let sharedBrowser: Browser;

setDefaultTimeout(env.defaultTimeoutMs);

BeforeAll(async () => {
  sharedBrowser = await chromium.launch({ headless: true });
});

AfterAll(async () => {
  await sharedBrowser?.close();
});

Before({ tags: "@ui" }, async function (this: CustomWorld) {
  this.browser = sharedBrowser;
  this.context = await this.browser.newContext({
    permissions: ["clipboard-read", "clipboard-write"],
  });
  this.page = await this.context.newPage();
});

Before({ tags: "@api" }, async function (this: CustomWorld) {
  this.apiContext = await this.createApiContext(env.apiBaseUrl);
});

After({ tags: "@ui" }, async function (this: CustomWorld) {
  await this.page?.close();
  await this.context?.close();
});

After({ tags: "@api" }, async function (this: CustomWorld) {
  await this.apiContext?.dispose();
});
