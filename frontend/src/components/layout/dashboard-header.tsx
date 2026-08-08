'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldCheck,
  Search,
  Bell,
  LogOut,
  Layers,
  Code,
  ShieldAlert,
  FileText,
  MessageSquare,
  LayoutDashboard,
  FolderGit2,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { NotificationDropdown } from './notification-dropdown';
import { DashboardService } from '@/services/dashboard.service';
import { NotificationAlert } from '@/types/dashboard';

export const DashboardHeader: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationAlert[]>([
    {
      id: '1',
      title: 'SQL Injection Finding',
      message: 'Critical SQL Injection detected in authentication module query.',
      severity: 'CRITICAL',
      type: 'VULNERABILITY',
      timestamp: new Date().toISOString(),
      created_at: new Date().toISOString(),
      read: false,
    },
    {
      id: '2',
      title: 'Report Export Complete',
      message: 'Executive Security Audit PDF generated successfully.',
      severity: 'INFO',
      type: 'REPORT_EXPORTED',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      created_at: new Date(Date.now() - 3600000).toISOString(),
      read: false,
    },
    {
      id: '3',
      title: 'SAST Scan Suite',
      message: 'Multi-agent scan suite completed with 92% pass rate.',
      type: 'SCAN_COMPLETE',
      severity: 'HIGH',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      created_at: new Date(Date.now() - 7200000).toISOString(),
      read: false,
    },
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    DashboardService.getSummary()
      .then((res) => {
        if (res.data?.notifications && res.data.notifications.length > 0) {
          setNotifications(res.data.notifications);
        }
      })
      .catch(() => {
        // Fallback default notifications
      });
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (notification: NotificationAlert) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
    );
  };

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Repositories', href: '/repositories', icon: FolderGit2 },
    { label: 'Code Review', href: '/code-review', icon: Code },
    { label: 'Security Agent', href: '/security-agent', icon: ShieldAlert },
    { label: 'Architecture', href: '/architecture', icon: Layers },
    { label: 'Reports', href: '/reports', icon: FileText },
    { label: 'Chat', href: '/chat', icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        {/* Logo & Navigation */}
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            aria-label="CodeGuardian AI Homepage"
            className="flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-primary rounded-lg focus-visible:outline-none"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="font-bold text-lg tracking-tight text-foreground">CodeGuardian AI</span>
          </Link>

          <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-1.5 border-l border-border pl-4">
            {navItems.map((item, idx) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
              return (
                <Link
                  key={idx}
                  href={item.href}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
                    isActive
                      ? 'bg-primary/10 text-primary border border-primary/30 font-bold shadow-sm'
                      : 'text-slate-300 hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <item.icon className={`h-3.5 w-3.5 ${isActive ? 'text-primary' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Global Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-xs mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              id="global-search"
              aria-label="Search Repositories, Rules, or CVEs"
              placeholder="Search Repositories, CVEs... (Cmd + K)"
              className="w-full rounded-xl border border-border bg-background/60 py-2 pl-9 pr-4 text-xs text-foreground placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>
        </div>

        {/* Right Action Icons & User Profile Menu */}
        <div className="flex items-center gap-3 relative" ref={dropdownRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            aria-label="Notifications"
            className={`relative rounded-lg border border-border p-2 transition focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
              notificationsOpen
                ? 'bg-primary/10 text-primary border-primary/40'
                : 'bg-background text-slate-400 hover:text-foreground hover:bg-accent'
            }`}
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm shadow-red-500/50">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Interactive Dropdown Panel */}
          <NotificationDropdown
            notifications={notifications}
            isOpen={notificationsOpen}
            onClose={() => setNotificationsOpen(false)}
            onMarkAllAsRead={handleMarkAllAsRead}
            onClearAll={handleClearAll}
            onNotificationClick={handleNotificationClick}
          />

          {user ? (
            <div className="flex items-center gap-3 border-l border-border pl-3">
              <div className="hidden sm:block text-right">
                <span className="block text-xs font-bold text-foreground">{user.full_name}</span>
                <span className="block text-[10px] text-slate-400 font-mono">{user.role}</span>
              </div>
              <button
                onClick={logout}
                aria-label="Sign Out"
                title="Sign Out"
                className="flex items-center justify-center rounded-lg border border-border bg-background p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
