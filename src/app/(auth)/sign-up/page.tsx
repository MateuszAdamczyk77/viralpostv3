import { Suspense } from 'react';
import { Metadata } from 'next';
import AuthPage from '../auth-page.client';

export const metadata: Metadata = {
  title: 'Sign Up | ViralPost',
  description: 'Create your ViralPost account and start making viral social media content',
};

/**
 * Sign-up page (Server Component)
 * Delegates to client component for interactivity
 */
export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <div className="w-full max-w-md">
        <Suspense fallback={<AuthPageSkeleton />}>
          <AuthPage mode="signup" />
        </Suspense>
      </div>
    </div>
  );
}

/**
 * Loading skeleton for auth page
 */
function AuthPageSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 space-y-6">
      <div className="space-y-2 text-center">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 bg-gray-200 rounded animate-pulse mx-8" />
      </div>
      
      <div className="space-y-4">
        <div className="h-12 bg-gray-200 rounded animate-pulse" />
        <div className="h-12 bg-gray-200 rounded animate-pulse" />
        <div className="h-12 bg-gray-200 rounded animate-pulse" />
        <div className="h-12 bg-gray-200 rounded animate-pulse" />
      </div>
      
      <div className="text-center">
        <div className="h-4 bg-gray-200 rounded animate-pulse mx-16" />
      </div>
    </div>
  );
} 