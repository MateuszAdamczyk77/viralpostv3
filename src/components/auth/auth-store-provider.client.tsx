'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';

interface AuthStoreProviderProps {
  children: React.ReactNode;
}

/**
 * Client-side wrapper for auth store to handle hydration
 * Prevents SSR hydration mismatches with Zustand
 */
export default function AuthStoreProvider({ children }: AuthStoreProviderProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Manually trigger hydration for Zustand store
    useAuthStore.persist.rehydrate();
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    // Return a minimal loading state during hydration
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
} 