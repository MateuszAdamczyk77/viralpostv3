import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/**
 * Authentication UI state interface
 * Manages client-side auth state for UI components
 */
interface AuthState {
  // Loading states
  isLoading: boolean;
  isSigningIn: boolean;
  isSigningUp: boolean;
  isResettingPassword: boolean;
  
  // Error states
  error: string | null;
  
  // Form states
  showPassword: boolean;
  rememberMe: boolean;
  
  // Actions
  setLoading: (loading: boolean) => void;
  setSigningIn: (signing: boolean) => void;
  setSigningUp: (signing: boolean) => void;
  setResettingPassword: (resetting: boolean) => void;
  setError: (error: string | null) => void;
  setShowPassword: (show: boolean) => void;
  setRememberMe: (remember: boolean) => void;
  clearError: () => void;
  reset: () => void;
}

/**
 * Initial state values
 */
const initialState = {
  isLoading: false,
  isSigningIn: false,
  isSigningUp: false,
  isResettingPassword: false,
  error: null,
  showPassword: false,
  rememberMe: false,
};

/**
 * Authentication UI state store
 * Manages loading states, errors, and form UI state
 * Uses persist middleware for rememberMe preference
 */
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        setLoading: (loading: boolean) => 
          set({ isLoading: loading }, false, 'setLoading'),
          
        setSigningIn: (signing: boolean) => 
          set({ isSigningIn: signing, isLoading: signing }, false, 'setSigningIn'),
          
        setSigningUp: (signing: boolean) => 
          set({ isSigningUp: signing, isLoading: signing }, false, 'setSigningUp'),
          
        setResettingPassword: (resetting: boolean) => 
          set({ isResettingPassword: resetting, isLoading: resetting }, false, 'setResettingPassword'),
          
        setError: (error: string | null) => 
          set({ error, isLoading: false }, false, 'setError'),
          
        setShowPassword: (show: boolean) => 
          set({ showPassword: show }, false, 'setShowPassword'),
          
        setRememberMe: (remember: boolean) => 
          set({ rememberMe: remember }, false, 'setRememberMe'),
          
        clearError: () => 
          set({ error: null }, false, 'clearError'),
          
        reset: () => 
          set({ 
            ...initialState, 
            rememberMe: get().rememberMe // Preserve rememberMe preference
          }, false, 'reset'),
      }),
      {
        name: 'auth-ui-state',
        // Only persist UI preferences, not loading states or errors
        partialize: (state) => ({ 
          rememberMe: state.rememberMe,
          showPassword: state.showPassword,
        }),
      },
    ),
    {
      name: 'auth-store',
    },
  ),
);

/**
 * Selector hooks for specific state slices to prevent unnecessary re-renders
 */
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useSigningIn = () => useAuthStore((state) => state.isSigningIn);
export const useSigningUp = () => useAuthStore((state) => state.isSigningUp);
export const useResettingPassword = () => useAuthStore((state) => state.isResettingPassword);
export const useShowPassword = () => useAuthStore((state) => state.showPassword);
export const useRememberMe = () => useAuthStore((state) => state.rememberMe);

/**
 * Action selectors for cleaner component code
 */
export const useAuthActions = () => useAuthStore((state) => ({
  setLoading: state.setLoading,
  setSigningIn: state.setSigningIn,
  setSigningUp: state.setSigningUp,
  setResettingPassword: state.setResettingPassword,
  setError: state.setError,
  setShowPassword: state.setShowPassword,
  setRememberMe: state.setRememberMe,
  clearError: state.clearError,
  reset: state.reset,
})); 