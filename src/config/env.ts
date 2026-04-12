import dotenv from "dotenv";

dotenv.config();

export const env = {
  uiBaseUrl: process.env.UI_BASE_URL ?? "http://localhost:8080/",
  apiBaseUrl:
    process.env.API_BASE_URL ?? "http://localhost:8080",
  apiAuthToken: process.env.API_AUTH_TOKEN,
  defaultTimeoutMs: Number(process.env.DEFAULT_TIMEOUT_MS ?? 30000)
};