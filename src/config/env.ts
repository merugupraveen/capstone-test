import dotenv from "dotenv";

dotenv.config();

export const env = {
  uiBaseUrl: process.env.UI_BASE_URL ?? "https://example.com",
  apiBaseUrl: process.env.API_BASE_URL ?? "https://jsonplaceholder.typicode.com",
  apiAuthToken: process.env.API_AUTH_TOKEN,
  defaultTimeoutMs: Number(process.env.DEFAULT_TIMEOUT_MS ?? 30000)
};
