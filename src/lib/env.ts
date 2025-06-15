import { z } from 'zod';

/**
 * Environment variables validation schema
 * Ensures all required environment variables are present and valid
 */
const envSchema = z.object({
  // Supabase configuration
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),

  // Google OAuth configuration (optional for pre-built flows)
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string().min(1, 'Google client ID is required').optional(),

  // Next.js environment
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  // App configuration
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

/**
 * Validated environment variables
 * This will throw an error if any required env vars are missing or invalid
 */
export const env = envSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

/**
 * Check if we're in production environment
 */
export const isProduction = env.NODE_ENV === 'production';

/**
 * Check if we're in development environment
 */
export const isDevelopment = env.NODE_ENV === 'development';

/**
 * Check if we're in test environment
 */
export const isTest = env.NODE_ENV === 'test';

/**
 * Check if Google OAuth is configured
 */
export const isGoogleOAuthEnabled = !!env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
