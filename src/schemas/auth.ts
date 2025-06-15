import { z } from 'zod'

/**
 * Email validation schema
 * Validates email format and normalizes to lowercase
 */
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .toLowerCase()
  .trim()

/**
 * Password validation schema
 * Enforces strong password requirements
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one lowercase letter, one uppercase letter, and one number'
  )

/**
 * OAuth provider validation schema
 */
export const oauthProviderSchema = z.enum(['google'], {
  errorMap: () => ({ message: 'Invalid OAuth provider' }),
})

/**
 * OAuth callback validation schema
 */
export const oauthCallbackSchema = z.object({
  code: z.string().min(1, 'Authorization code is required'),
  state: z.string().optional(),
  next: z.string().optional().default('/'),
})

/**
 * Sign in form validation schema
 */
export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

/**
 * Sign up form validation schema
 */
export const signUpSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

/**
 * Password reset request schema
 */
export const passwordResetSchema = z.object({
  email: emailSchema,
})

/**
 * Password update schema
 */
export const passwordUpdateSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

/**
 * OAuth sign-in options schema
 */
export const oauthSignInOptionsSchema = z.object({
  provider: oauthProviderSchema,
  redirectTo: z.string().url().optional(),
  scopes: z.string().optional(),
})

// Export inferred types
export type SignInInput = z.infer<typeof signInSchema>
export type SignUpInput = z.infer<typeof signUpSchema>
export type PasswordResetInput = z.infer<typeof passwordResetSchema>
export type PasswordUpdateInput = z.infer<typeof passwordUpdateSchema>
export type OAuthProvider = z.infer<typeof oauthProviderSchema>
export type OAuthCallbackInput = z.infer<typeof oauthCallbackSchema>
export type OAuthSignInOptions = z.infer<typeof oauthSignInOptionsSchema> 