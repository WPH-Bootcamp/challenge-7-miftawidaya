import { z } from 'zod';

/**
 * Login Validation Schema
 */
export const loginSchema = z.object({
  email: z
    .email({ error: 'Invalid email format' })
    .min(1, { error: 'Email is required' }),
  password: z
    .string()
    .min(6, { error: 'Password must be at least 6 characters' }),
});

/**
 * Register Validation Schema
 */
export const registerSchema = loginSchema.extend({
  name: z.string().min(2, { error: 'Name must be at least 2 characters' }),
  phone: z
    .string()
    .min(1, { error: 'Phone number is required' })
    .regex(/^(?:\+62|62|0)8[1-9]\d{7,10}$/, {
      error: 'Invalid Indonesian phone number format',
    }),
});

export const profileSchema = z.object({
  name: z.string().min(2, { error: 'Name must be at least 2 characters' }),
  email: z
    .email({ error: 'Invalid email format' })
    .min(1, { error: 'Email is required' }),
  phone: z
    .string()
    .min(1, { error: 'Phone number is required' })
    .regex(/^(?:\+62|62|0)8[1-9]\d{7,10}$/, {
      error: 'Invalid Indonesian phone number format',
    }),
});

export type LoginType = z.infer<typeof loginSchema>;
export type RegisterType = z.infer<typeof registerSchema>;
export type ProfileType = z.infer<typeof profileSchema>;
