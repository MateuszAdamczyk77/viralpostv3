import { createClient } from '@/lib/supabase/client'
import type { OAuthProvider, OAuthSignInOptions } from '@/schemas/auth'
import { env } from '@/lib/env'

/**
 * Sign in with OAuth provider (Google)
 * For PKCE flow in Server-Side Auth
 */
export async function signInWithOAuth(options: OAuthSignInOptions) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: options.provider,
    options: {
      redirectTo: options.redirectTo || `${env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`,
      ...(options.scopes && { queryParams: { scope: options.scopes } }),
    },
  })

  if (error) {
    console.error('OAuth sign-in error:', error)
    throw new Error(`Failed to sign in with ${options.provider}: ${error.message}`)
  }

  return data
}

/**
 * Sign in with Google using application code approach
 * Automatically redirects to Google's consent screen
 */
export async function signInWithGoogle(redirectTo?: string) {
  return signInWithOAuth({
    provider: 'google',
    redirectTo,
  })
}

/**
 * Sign in with Google ID Token (for Google pre-built flows)
 * Used with Google's One Tap or pre-built sign-in buttons
 */
export async function signInWithGoogleIdToken(
  token: string,
  nonce?: string
) {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'google',
    token,
    ...(nonce && { nonce }),
  })

  if (error) {
    console.error('Google ID token sign-in error:', error)
    throw new Error(`Failed to sign in with Google ID token: ${error.message}`)
  }

  return data
}

/**
 * Generate a secure nonce for Google ID token authentication
 * Returns both the raw nonce and hashed nonce for Google's requirements
 */
export async function generateNonce(): Promise<{ nonce: string; hashedNonce: string }> {
  const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))))
  const encoder = new TextEncoder()
  const encodedNonce = encoder.encode(nonce)
  const hashBuffer = await crypto.subtle.digest('SHA-256', encodedNonce)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashedNonce = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  
  return { nonce, hashedNonce }
}

/**
 * Get the Google OAuth configuration
 */
export function getGoogleOAuthConfig() {
  return {
    clientId: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    redirectUri: `${env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`,
    isEnabled: !!env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  }
} 