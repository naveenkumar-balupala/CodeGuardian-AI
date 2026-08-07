'use client';

import React, { useState } from 'react';
import { Mail, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { AuthService } from '@/services/auth.service';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await AuthService.forgotPassword(email);
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Request failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-border bg-card p-8 shadow-2xl">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Reset Password</h2>
          <p className="mt-2 text-sm text-slate-400">Enter your email address to receive password reset instructions.</p>
        </div>

        {sent ? (
          <div className="rounded-xl border border-emerald-500/50 bg-emerald-500/10 p-6 text-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto mb-2" />
            <h3 className="font-bold text-lg text-emerald-300">Reset Email Sent</h3>
            <p className="text-xs text-slate-300 mt-2 mb-4">If an account exists for {email}, instructions have been dispatched.</p>
            <a href="/login" className="inline-block px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90">
              Return to Login
            </a>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-xs text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm text-foreground focus:border-primary focus:outline-none"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition"
            >
              {loading ? 'Sending Link...' : 'Send Reset Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
