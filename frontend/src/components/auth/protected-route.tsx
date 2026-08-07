'use client';

import React from 'react';
import { useAuth } from '@/context/auth-context';
import { UserRole } from '@/types/auth';
import { ShieldAlert, Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-background">
        <ShieldAlert className="h-12 w-12 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
        <p className="text-slate-400 mb-6">Please log in to access CodeGuardian AI security platform.</p>
        <a href="/login" className="px-6 py-2 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90">
          Go to Login
        </a>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-background">
        <ShieldAlert className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Access Denied (403)</h2>
        <p className="text-slate-400">Your role ({user.role}) does not have permission to view this resource.</p>
      </div>
    );
  }

  return <>{children}</>;
};
