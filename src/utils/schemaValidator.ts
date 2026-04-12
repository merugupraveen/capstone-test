import { ZodSchema } from "zod";

export function validateSchema<T>(schema: ZodSchema<T>, payload: unknown): T {
  return schema.parse(payload);
}
