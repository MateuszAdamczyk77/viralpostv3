'use client';

import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import GoogleAuthButton from '@/components/auth/google-auth-button.client';
import EmailAuthForm from '@/components/auth/email-auth-form.client';
import AuthErrorDisplay from '@/components/auth/auth-error-display';
import { useAuth, useAuthRole } from '@/hooks/use-auth';
import { useAuthStore, useAuthActions } from '@/stores/auth-store';

/**
 * Auth components demo page
 * Demonstrates all authentication components and their states
 * Useful for development and testing
 */
export default function AuthDemoPage() {
  const [formMode, setFormMode] = useState<'signin' | 'signup'>('signin');
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const { isAdmin, isPremium, userRole } = useAuthRole();
  const authState = useAuthStore();
  const { setError, clearError } = useAuthActions();

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTestError = useCallback(() => {
    setError('This is a test error message to demonstrate error handling.');
  }, [setError]);

  const handleClearError = useCallback(() => {
    clearError();
  }, [clearError]);

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Auth Components Demo
          </h1>
          <p className="text-lg text-gray-600">
            Interactive demonstration of all authentication components
          </p>
        </div>

        {/* Auth State Display */}
        <Card>
          <CardHeader>
            <CardTitle>Current Authentication State</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}</p>
                <p><strong>Loading:</strong> {isLoading ? '⏳ Yes' : '✅ No'}</p>
                <p><strong>User Email:</strong> {user?.email || 'None'}</p>
                <p><strong>User Role:</strong> {userRole}</p>
              </div>
              <div>
                <p><strong>Is Admin:</strong> {isAdmin() ? '✅ Yes' : '❌ No'}</p>
                <p><strong>Is Premium:</strong> {isPremium() ? '✅ Yes' : '❌ No'}</p>
                <p><strong>User ID:</strong> {user?.id?.slice(0, 8) || 'None'}...</p>
              </div>
            </div>
            
            {isAuthenticated && (
              <Button onClick={signOut} variant="outline">
                Sign Out
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Store State Display */}
        <Card>
          <CardHeader>
            <CardTitle>Zustand Store State</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(authState, null, 2)}
            </pre>
            <div className="mt-4 space-x-2">
              <Button onClick={handleTestError} variant="destructive" size="sm">
                Test Error
              </Button>
              <Button onClick={handleClearError} variant="outline" size="sm">
                Clear Error
              </Button>
            </div>
          </CardContent>
        </Card>

        {!isAuthenticated && (
          <>
            {/* Error Display Demo */}
            <Card>
              <CardHeader>
                <CardTitle>Error Display Component</CardTitle>
              </CardHeader>
              <CardContent>
                <AuthErrorDisplay />
                {!authState.error && (
                  <p className="text-gray-500 italic">No errors to display</p>
                )}
              </CardContent>
            </Card>

            {/* Google OAuth Demo */}
            <Card>
              <CardHeader>
                <CardTitle>Google OAuth Button</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Sign-in mode:</p>
                  <GoogleAuthButton mode="signin" redirectTo="/auth-demo" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Sign-up mode:</p>
                  <GoogleAuthButton mode="signup" redirectTo="/auth-demo" />
                </div>
              </CardContent>
            </Card>

            {/* Email Form Demo */}
            <Card>
              <CardHeader>
                <CardTitle>Email Authentication Form</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setFormMode('signin')}
                    variant={formMode === 'signin' ? 'default' : 'outline'}
                    size="sm"
                  >
                    Sign In Mode
                  </Button>
                  <Button
                    onClick={() => setFormMode('signup')}
                    variant={formMode === 'signup' ? 'default' : 'outline'}
                    size="sm"
                  >
                    Sign Up Mode
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <EmailAuthForm
                  mode={formMode}
                  redirectTo="/auth-demo"
                  onSuccess={() => console.log('Auth success!')}
                  onModeChange={setFormMode}
                />
              </CardContent>
            </Card>
          </>
        )}

        {/* Usage Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Examples</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Basic Authentication Check:</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm">
{`import { useAuth } from '@/hooks/use-auth';

function ProtectedComponent() {
  const { isAuthenticated, user, signOut } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please sign in</div>;
  }
  
  return (
    <div>
      Welcome, {user.email}!
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}`}
              </pre>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-2">Using Auth Store for UI State:</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm">
{`import { useAuthActions, useAuthError } from '@/stores/auth-store';

function MyComponent() {
  const { setError, clearError } = useAuthActions();
  const error = useAuthError();
  
  const handleAction = async () => {
    try {
      // Your auth logic here
    } catch (err) {
      setError(err.message);
    }
  };
  
  return (
    <div>
      {error && <div className="error">{error}</div>}
      <button onClick={handleAction}>Do Something</button>
    </div>
  );
}`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 