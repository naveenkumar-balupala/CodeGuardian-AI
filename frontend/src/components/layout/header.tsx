import React from 'react';
import { Shield } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full border-b border-border bg-card/50 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg tracking-tight">CodeGuardian AI</span>
        </div>
        <nav className="flex items-center gap-6 text-sm text-slate-400">
          <a href="#overview" className="hover:text-foreground transition">Overview</a>
          <a href="#architecture" className="hover:text-foreground transition">Architecture</a>
          <a href="#docs" className="hover:text-foreground transition">Docs</a>
        </nav>
      </div>
    </header>
  );
};
