/**
 * Sign-in form validation — the mobile counterpart of the web app's
 * `utils/validators/login.schema.ts`, using zod.
 */
import { z } from 'zod';

export const loginSchema = z.object({
  userId: z.string().trim().min(1, { message: 'User ID is required.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
  remember: z.boolean(),
});

export type LoginSchema = z.infer<typeof loginSchema>;

/** Per-field error messages keyed by field name. */
export type LoginErrors = Partial<Record<keyof LoginSchema, string>>;
