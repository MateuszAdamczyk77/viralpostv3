import type { User } from '@supabase/supabase-js';
import type { OAuthProvider } from '@/schemas/auth';

/**
 * Authentication state for client components
 */
export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

/**
 * Auth form field errors
 */
export interface AuthFormErrors {
  email?: string[];
  password?: string[];
  confirmPassword?: string[];
  general?: string[];
}

/**
 * Auth action result
 */
export interface AuthActionResult {
  success: boolean;
  error?: string;
  fieldErrors?: AuthFormErrors;
  data?: Record<string, unknown>;
}

/**
 * OAuth authentication result
 */
export interface OAuthResult {
  url?: string;
  provider: OAuthProvider;
  error?: string;
}

/**
 * Google OAuth configuration
 */
export interface GoogleOAuthConfig {
  clientId?: string;
  redirectUri: string;
  isEnabled: boolean;
}

/**
 * OAuth callback parameters
 */
export interface OAuthCallbackParams {
  code: string;
  state?: string;
  next?: string;
  error?: string;
  error_description?: string;
}

/**
 * Protected page props
 */
export interface ProtectedPageProps {
  user: User;
}

/**
 * Auth context type
 */
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<AuthActionResult>;
  signUp: (email: string, password: string) => Promise<AuthActionResult>;
  signInWithGoogle: (redirectTo?: string) => Promise<OAuthResult>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthActionResult>;
}

/**
 * Session configuration
 */
export interface SessionConfig {
  expiresIn: number;
  refreshThreshold: number;
  autoRefresh: boolean;
}

/**
 * Auth provider configuration
 */
export interface AuthProviderConfig {
  enableEmailAuth: boolean;
  enableGoogleAuth: boolean;
  googleClientId?: string;
  requireEmailVerification: boolean;
  sessionDuration: number;
}
