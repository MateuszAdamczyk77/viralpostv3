import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

/**
 * Auth layout component
 * Simple layout for authentication pages
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="auth-layout">
      {children}
    </div>
  );
} 