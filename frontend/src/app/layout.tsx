import type { Metadata } from 'next';
import { AuthProvider } from '@/context/auth-context';
import { ErrorBoundary } from '@/components/common/error-boundary';
import './globals.css';

export const metadata: Metadata = {
  title: 'CodeGuardian AI | Enterprise Platform',
  description: 'AI-Powered Code Analysis & Automated Security Engineering',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
        <AuthProvider>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </AuthProvider>
      </body>
    </html>
  );
}
