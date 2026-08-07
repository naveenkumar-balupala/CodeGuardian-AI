'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Github, KeyRound, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { AuthService } from '@/services/auth.service';
import { useAuth } from '@/context/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { setAuthTokens } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totpCode, setTotpCode] = useState('');
  const [requires2FA, setRequires2FA] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await AuthService.login({
        email,
        password,
        totp_code: requires2FA ? totpCode : undefined,
      });

      setAuthTokens(response.data);
      router.push('/');
    } catch (err: any) {
      if (err.message?.includes('2FA')) {
        setRequires2FA(true);
      }
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'github' | 'google') => {
    try {
      const response = provider === 'github'
        ? await AuthService.getGitHubAuthUrl()
        : await AuthService.getGoogleAuthUrl();
      window.location.href = response.data.url;
    } catch {
      setError(`Failed to initiate ${provider} OAuth authentication.`);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-border bg-card p-8 shadow-2xl">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Sign in to CodeGuardian AI</h2>
          <p className="mt-2 text-sm text-slate-400">Enterprise AI-Powered Security Engineering</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
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

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-300">Password</label>
                <a href="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm text-foreground focus:border-primary focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {requires2FA && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">2FA Security Code</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm text-foreground focus:border-primary focus:outline-none"
                    placeholder="Enter 6-digit code"
                  />
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="relative my-6 text-center text-xs text-slate-500">
          <span className="bg-card px-2">Or continue with</span>
          <div className="absolute inset-0 top-1/2 -z-10 border-t border-border"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleOAuthLogin('github')}
            className="flex items-center justify-center gap-2 rounded-lg border border-border bg-background py-2 text-xs font-medium text-foreground hover:bg-accent transition"
          >
            <Github className="h-4 w-4" /> GitHub
          </button>
          <button
            onClick={() => handleOAuthLogin('google')}
            className="flex items-center justify-center gap-2 rounded-lg border border-border bg-background py-2 text-xs font-medium text-foreground hover:bg-accent transition"
          >
            <span className="font-bold text-blue-500">G</span> Google
          </button>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Don&apos;t have an account?{' '}
          <a href="/register" className="font-semibold text-primary hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
}
