import { AlertCircle, X } from 'lucide-react';
import { useAuthError, useAuthActions } from '@/stores/auth-store';

interface AuthErrorDisplayProps {
  className?: string;
}

/**
 * Authentication error display component
 * Shows auth errors with dismiss functionality
 * Automatically integrates with the auth store
 */
export default function AuthErrorDisplay({ className = '' }: AuthErrorDisplayProps) {
  const error = useAuthError();
  const { clearError } = useAuthActions();

  if (!error) {
    return null;
  }

  return (
    <div 
      className={`flex items-start gap-3 rounded-md border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive ${className}`}
      role="alert"
      aria-live="polite"
    >
      <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-medium">Authentication Error</p>
        <p className="mt-1 text-destructive/80">{error}</p>
      </div>
      <button
        type="button"
        onClick={clearError}
        className="flex-shrink-0 rounded-sm p-1 hover:bg-destructive/20 focus:outline-none focus:ring-2 focus:ring-destructive/40"
        aria-label="Dismiss error"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
} 