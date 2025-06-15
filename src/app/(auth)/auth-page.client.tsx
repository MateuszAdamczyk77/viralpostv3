'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import GoogleAuthButton from '@/components/auth/google-auth-button.client';
import EmailAuthForm from '@/components/auth/email-auth-form.client';
import AuthErrorDisplay from '@/components/auth/auth-error-display';
import { useAuth } from '@/hooks/use-auth';

interface AuthPageProps {
  mode: 'signin' | 'signup';
}

/**
 * Complete authentication page client component
 * Combines Google OAuth, email forms, and error handling
 * Handles redirects and success states
 */
export default function AuthPage({ mode: initialMode }: AuthPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  
  const redirectTo = searchParams?.get('next') || '/dashboard';

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  const handleAuthSuccess = () => {
    // The useEffect above will handle the redirect
    console.log('Authentication successful, redirecting...');
  };

  const handleModeChange = (newMode: 'signin' | 'signup') => {
    setMode(newMode);
    // Update URL without triggering a page reload
    const newPath = newMode === 'signin' ? '/auth/sign-in' : '/auth/sign-up';
    const currentParams = searchParams?.toString();
    const newUrl = currentParams ? `${newPath}?${currentParams}` : newPath;
    router.replace(newUrl);
  };

  // Show loading state if checking authentication
  if (isLoading) {
    return (
      <Card className="bg-white shadow-lg">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Don't render if already authenticated (redirect will happen)
  if (isAuthenticated) {
    return null;
  }

  return (
    <Card className="bg-white shadow-lg">
      <CardHeader className="pb-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">ViralPost</h2>
          <p className="text-sm text-gray-600">
            Create viral social media content with AI
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6 p-8 pt-4">
        {/* Error Display */}
        <AuthErrorDisplay />
        
        {/* Google OAuth Button */}
        <GoogleAuthButton
          mode={mode}
          redirectTo={redirectTo}
          className="mb-4"
        />
        
        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-muted-foreground">
              Or continue with email
            </span>
          </div>
        </div>
        
        {/* Email Form */}
        <EmailAuthForm
          mode={mode}
          redirectTo={redirectTo}
          onSuccess={handleAuthSuccess}
          onModeChange={handleModeChange}
        />
        
        {/* Additional Links */}
        <div className="space-y-2 text-center text-sm">
          {mode === 'signin' && (
            <p>
              <a 
                href="/auth/reset-password" 
                className="text-primary hover:underline"
              >
                Forgot your password?
              </a>
            </p>
          )}
          
          <p className="text-xs text-muted-foreground">
            By continuing, you agree to our{' '}
            <a href="/terms" className="text-primary hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 