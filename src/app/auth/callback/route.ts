import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { oauthCallbackSchema } from '@/schemas/auth';

/**
 * OAuth callback handler for Google authentication
 * Handles the code exchange for session after OAuth redirect
 *
 * Based on official Supabase Next.js guide:
 * https://supabase.com/docs/guides/auth/social-login/auth-google#signing-users-in
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const { searchParams, origin } = requestUrl;

  try {
    // Validate callback parameters
    const { code, next } = oauthCallbackSchema.parse({
      code: searchParams.get('code'),
      state: searchParams.get('state'),
      next: searchParams.get('next'),
    });

    if (code) {
      const supabase = await createClient();

      // Exchange the OAuth code for a session
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        // Successful authentication - redirect to intended page
        const forwardedHost = request.headers.get('x-forwarded-host'); // original origin before load balancer
        const isLocalEnv = process.env.NODE_ENV === 'development';

        if (isLocalEnv) {
          // Local development - no load balancer
          return NextResponse.redirect(`${origin}${next}`);
        } else if (forwardedHost) {
          // Production with load balancer
          return NextResponse.redirect(`https://${forwardedHost}${next}`);
        } else {
          // Fallback
          return NextResponse.redirect(`${origin}${next}`);
        }
      } else {
        // Auth error occurred
        console.error('OAuth code exchange error:', error);
        return NextResponse.redirect(
          `${origin}/auth/error?message=${encodeURIComponent(error.message)}`,
        );
      }
    }
  } catch (validationError) {
    console.error('OAuth callback validation error:', validationError);
    return NextResponse.redirect(
      `${origin}/auth/error?message=${encodeURIComponent('Invalid callback parameters')}`,
    );
  }

  // No code provided or other error
  return NextResponse.redirect(
    `${origin}/auth/error?message=${encodeURIComponent('Authentication failed')}`,
  );
}
