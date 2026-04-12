import { APIRequestContext, APIResponse } from "playwright";

export class ApiClient {
  private readonly requestContext: APIRequestContext;

  constructor(requestContext: APIRequestContext) {
    this.requestContext = requestContext;
  }

  async get(path: string, headers?: Record<string, string>): Promise<APIResponse> {
    return this.requestContext.get(path, { headers });
  }

  async post(path: string, data: unknown, headers?: Record<string, string>): Promise<APIResponse> {
    return this.requestContext.post(path, { data, headers });
  }
}
