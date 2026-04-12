import { expect } from "@playwright/test";

export function expectStatusCode(actual: number, expected: number): void {
  expect(actual).toBe(expected);
}

export function expectTruthy(value: unknown): void {
  expect(value).toBeTruthy();
}
