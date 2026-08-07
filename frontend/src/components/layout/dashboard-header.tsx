'use client';

import React from 'react';
import { ShieldCheck, Search, Bell, Building2, User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export const DashboardHeader: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        {/* Logo & Org Selector */}
        <div className="flex items-center gap-6">
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg tracking-tight text-foreground">CodeGuardian AI</span>
          </a>

          <div className="hidden md:flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-slate-300">
            <Building2 className="h-3.5 w-3.5 text-primary" />
            <span>CodeGuardian Enterprise</span>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search Repositories, Rules, or CVEs... (Cmd + K)"
              className="w-full rounded-xl border border-border bg-background/60 py-2 pl-9 pr-4 text-xs text-foreground placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Right Action Icons & User Profile Menu */}
        <div className="flex items-center gap-4">
          <button className="relative rounded-lg border border-border bg-background p-2 text-slate-400 hover:text-foreground hover:bg-accent transition">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              3
            </span>
          </button>

          {user ? (
            <div className="flex items-center gap-3 border-l border-border pl-4">
              <div className="hidden sm:block text-right">
                <span className="block text-xs font-bold text-foreground">{user.full_name}</span>
                <span className="block text-[10px] text-slate-400 font-mono">{user.role}</span>
              </div>
              <button
                onClick={logout}
                title="Sign Out"
                className="flex items-center justify-center rounded-lg border border-border bg-background p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <a href="/login" className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90">
              Sign In
            </a>
          )}
        </div>
      </div>
    </header>
  );
};
