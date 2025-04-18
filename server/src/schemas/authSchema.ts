// src/schemas/authSchema.ts
import { z } from 'zod';

export const startOAuthSchema = z.object({
  body: z.object({
    redirectPath: z.string().optional()
  })
});