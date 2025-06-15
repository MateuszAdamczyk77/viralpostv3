'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { 
  signInSchema, 
  signUpSchema, 
  type SignInInput, 
  type SignUpInput 
} from '@/schemas/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  useAuthActions, 
  useSigningIn, 
  useSigningUp, 
  useShowPassword 
} from '@/stores/auth-store';

interface EmailAuthFormProps {
  mode: 'signin' | 'signup';
  redirectTo?: string;
  onSuccess?: () => void;
  onModeChange?: (mode: 'signin' | 'signup') => void;
  className?: string;
}

/**
 * Email/Password authentication form component
 * Supports both sign-in and sign-up modes with real-time validation
 * 
 * @param mode - Whether this is a sign-in or sign-up form
 * @param redirectTo - URL to redirect to after successful authentication
 * @param onSuccess - Callback function called on successful authentication
 * @param onModeChange - Callback to switch between signin/signup modes
 * @param className - Additional CSS classes
 */
export default function EmailAuthForm({
  mode,
  redirectTo = '/',
  onSuccess,
  onModeChange,
  className = '',
}: EmailAuthFormProps) {
  const supabase = createClient();
  const { 
    setSigningIn, 
    setSigningUp, 
    setError, 
    clearError, 
    setShowPassword 
  } = useAuthActions();
  const isSigningIn = useSigningIn();
  const isSigningUp = useSigningUp();
  const showPassword = useShowPassword();
  const [isLocalLoading, setIsLocalLoading] = useState(false);

  // Use different schemas based on mode
  const schema = mode === 'signin' ? signInSchema : signUpSchema;
  const form = useForm<SignInInput | SignUpInput>({
    resolver: zodResolver(schema),
    mode: 'onChange', // Enable real-time validation
    defaultValues: {
      email: '',
      password: '',
      ...(mode === 'signup' && { confirmPassword: '' }),
    },
  });

  const { handleSubmit, formState: { errors, isValid } } = form;
  const isLoading = (mode === 'signin' ? isSigningIn : isSigningUp) || isLocalLoading;

  const onSubmit = async (data: SignInInput | SignUpInput) => {
    try {
      setIsLocalLoading(true);
      clearError();
      
      if (mode === 'signin') {
        setSigningIn(true);
        await handleSignIn(data as SignInInput);
      } else {
        setSigningUp(true);
        await handleSignUp(data as SignUpInput);
      }
    } catch (error) {
      console.error(`${mode} error:`, error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : `Failed to ${mode === 'signin' ? 'sign in' : 'sign up'}. Please try again.`;
        
      setError(errorMessage);
    } finally {
      setIsLocalLoading(false);
      setSigningIn(false);
      setSigningUp(false);
    }
  };

  const handleSignIn = async (data: SignInInput) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      throw new Error(getAuthErrorMessage(error));
    }

    // Redirect is handled by middleware/auth state change
    onSuccess?.();
  };

  const handleSignUp = async (data: SignUpInput) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
      },
    });

    if (error) {
      throw new Error(getAuthErrorMessage(error));
    }

    // Show success message for email confirmation
    setError(null);
    onSuccess?.();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleModeSwitch = () => {
    clearError();
    form.reset();
    onModeChange?.(mode === 'signin' ? 'signup' : 'signin');
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">
          {mode === 'signin' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="text-muted-foreground">
          {mode === 'signin' 
            ? 'Enter your email and password to sign in' 
            : 'Enter your details to create your account'
          }
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      autoComplete="email"
                      disabled={isLoading}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      {...field}
                      type={showPassword ? 'text' : 'password'}
                      placeholder={mode === 'signin' ? 'Enter your password' : 'Create a strong password'}
                      className="pl-10 pr-10"
                      autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password Field (Sign-up only) */}
          {mode === 'signup' && (
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        className="pl-10"
                        autoComplete="new-password"
                        disabled={isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading || !isValid}
          >
            {isLoading ? (
              <>
                <LoadingSpinner className="mr-2 h-4 w-4" />
                {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
              </>
            ) : (
              <>
                <User className="mr-2 h-4 w-4" />
                {mode === 'signin' ? 'Sign in' : 'Create account'}
              </>
            )}
          </Button>
        </form>
      </Form>

      {/* Mode Switch */}
      {onModeChange && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={handleModeSwitch}
              className="font-medium text-primary hover:underline"
              disabled={isLoading}
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      )}

      {/* Password Requirements (Sign-up only) */}
      {mode === 'signup' && (
        <div className="text-xs text-muted-foreground space-y-1">
          <p className="font-medium">Password requirements:</p>
          <ul className="space-y-1 ml-4">
            <li>• At least 8 characters long</li>
            <li>• Contains uppercase and lowercase letters</li>
            <li>• Contains at least one number</li>
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * Converts Supabase auth errors to user-friendly messages
 */
function getAuthErrorMessage(error: any): string {
  const message = error.message?.toLowerCase() || '';
  
  if (message.includes('invalid login credentials')) {
    return 'Invalid email or password. Please check your credentials and try again.';
  }
  
  if (message.includes('email not confirmed')) {
    return 'Please check your email and click the confirmation link before signing in.';
  }
  
  if (message.includes('user already registered')) {
    return 'An account with this email already exists. Please sign in instead.';
  }
  
  if (message.includes('password should be at least')) {
    return 'Password must be at least 8 characters long.';
  }
  
  if (message.includes('signup is disabled')) {
    return 'New registrations are currently disabled. Please contact support.';
  }
  
  if (message.includes('email rate limit exceeded')) {
    return 'Too many email attempts. Please wait a few minutes before trying again.';
  }
  
  // Default fallback
  return error.message || 'An unexpected error occurred. Please try again.';
}

/**
 * Loading spinner component
 */
function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
} 