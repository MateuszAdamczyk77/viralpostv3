'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuthActions } from '@/stores/auth-store';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

/**
 * Custom auth hook for client-side authentication state
 * Provides current user, session, and auth actions
 * Integrates with the auth store for UI state management
 * 
 * @returns Object containing auth state and actions
 */
export function useAuth(): AuthState & AuthActions {
  const supabase = createClient();
  const { setError, setLoading } = useAuthActions();
  
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setError(error.message);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Unexpected error getting session:', error);
        setError('Failed to load authentication state');
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);

        // Handle specific auth events
        switch (event) {
          case 'SIGNED_IN':
            console.log('User signed in:', session?.user?.email);
            break;
          case 'SIGNED_OUT':
            console.log('User signed out');
            break;
          case 'TOKEN_REFRESHED':
            console.log('Token refreshed for user:', session?.user?.email);
            break;
          case 'USER_UPDATED':
            console.log('User updated:', session?.user?.email);
            break;
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]); // Remove setError from dependency array

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Sign out error:', error);
      setError(error instanceof Error ? error.message : 'Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  const refreshSession = async (): Promise<void> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        throw error;
      }
      
      setSession(data.session);
      setUser(data.session?.user ?? null);
    } catch (error) {
      console.error('Refresh session error:', error);
      setError(error instanceof Error ? error.message : 'Failed to refresh session');
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    signOut,
    refreshSession,
  };
}

/**
 * Hook to check if user has specific role or permission
 * Can be extended based on your user metadata structure
 */
export function useAuthRole() {
  const { user } = useAuth();
  
  const hasRole = (role: string): boolean => {
    return user?.user_metadata?.role === role || 
           user?.app_metadata?.role === role || 
           false;
  };

  const isAdmin = (): boolean => hasRole('admin');
  const isPremium = (): boolean => hasRole('premium') || isAdmin();

  return {
    hasRole,
    isAdmin,
    isPremium,
    userRole: user?.user_metadata?.role || user?.app_metadata?.role || 'user',
  };
}

/**
 * Hook for protected components that require authentication
 * Automatically redirects to sign-in if not authenticated
 */
export function useRequireAuth(redirectTo: string = '/sign-in') {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Client-side redirect
      const currentPath = window.location.pathname;
      const redirectUrl = `${redirectTo}?next=${encodeURIComponent(currentPath)}`;
      window.location.href = redirectUrl;
    }
  }, [isAuthenticated, isLoading, redirectTo]);

  return { isAuthenticated, isLoading };
} 