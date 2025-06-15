import Link from 'next/link';
import { Suspense } from 'react';

interface AuthErrorPageProps {
  searchParams: Promise<{ message?: string }>;
}

/**
 * Authentication error page
 * Displays OAuth and other authentication errors
 */
export default async function AuthErrorPage({ searchParams }: AuthErrorPageProps) {
  const params = await searchParams;
  const errorMessage = params.message || 'An authentication error occurred';

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <Suspense fallback={<div>Loading...</div>}>
            <p className="mt-2 text-center text-sm text-gray-600">
              {decodeURIComponent(errorMessage)}
            </p>
          </Suspense>
        </div>

        <div className="mt-8 space-y-6">
          <div className="space-y-2 text-center">
            <Link
              href="/login"
              className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
