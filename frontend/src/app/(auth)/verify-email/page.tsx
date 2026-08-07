'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { AuthService } from '@/services/auth.service';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function verify() {
      if (!token) {
        setError('Missing verification token.');
        setLoading(false);
        return;
      }

      try {
        await AuthService.verifyEmail(token);
        setSuccess(true);
      } catch (err: any) {
        setError(err.message || 'Email verification failed or token expired.');
      } finally {
        setLoading(false);
      }
    }

    verify();
  }, [token]);

  return (
    <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-8 shadow-2xl text-center">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
        <ShieldCheck className="h-6 w-6" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight text-foreground">Email Verification</h2>

      {loading ? (
        <div className="flex flex-col items-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-xs text-slate-400">Verifying your email address token...</p>
        </div>
      ) : success ? (
        <div className="rounded-xl border border-emerald-500/50 bg-emerald-500/10 p-6 text-center">
          <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto mb-2" />
          <h3 className="font-bold text-lg text-emerald-300">Email Verified!</h3>
          <p className="text-xs text-slate-300 mt-2 mb-4">Your account is active. You may now sign in.</p>
          <a href="/login" className="inline-block px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90">
            Sign In
          </a>
        </div>
      ) : (
        <div className="rounded-xl border border-red-500/50 bg-red-500/10 p-6 text-center">
          <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-2" />
          <h3 className="font-bold text-lg text-red-300">Verification Failed</h3>
          <p className="text-xs text-slate-300 mt-2 mb-4">{error}</p>
          <a href="/login" className="inline-block px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90">
            Return to Login
          </a>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <Suspense fallback={
        <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-border bg-card text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-xs text-slate-400">Loading verification details...</p>
        </div>
      }>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
