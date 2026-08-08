'use client';

import React, { useEffect } from 'react';
import { ShieldAlert, RefreshCw, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to diagnostic logging system
    console.error('Unhandled Application Error caught by Next.js Error Boundary:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-background text-foreground text-center">
      <div className="max-w-md w-full rounded-2xl border border-border bg-card/80 p-8 shadow-2xl backdrop-blur-md space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-extrabold tracking-tight text-foreground">
            Something went wrong!
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            An unexpected client application error occurred. CodeGuardian AI caught the exception gracefully.
          </p>
          {process.env.NODE_ENV === 'development' && error.message && (
            <div className="mt-3 rounded-lg bg-red-950/40 border border-red-900/40 p-3 text-left">
              <span className="block text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1">
                Diagnostic Output
              </span>
              <p className="text-[11px] font-mono text-red-300 break-words">{error.message}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition shadow-lg shadow-primary/20"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 py-2.5 text-xs font-semibold text-foreground hover:bg-accent transition"
          >
            <LayoutDashboard className="h-4 w-4 text-primary" />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
