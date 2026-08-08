'use client';

import React from 'react';
import {
  Bell,
  ShieldAlert,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Info,
  CheckCheck,
  Trash2,
  X,
  ExternalLink,
} from 'lucide-react';
import { NotificationAlert } from '@/types/dashboard';

interface Props {
  notifications: NotificationAlert[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onNotificationClick?: (notification: NotificationAlert) => void;
}

export const NotificationDropdown: React.FC<Props> = ({
  notifications,
  isOpen,
  onClose,
  onMarkAllAsRead,
  onClearAll,
  onNotificationClick,
}) => {
  if (!isOpen) return null;

  const getSeverityIcon = (severity?: string, type?: string) => {
    if (type === 'SCAN_COMPLETE') return <CheckCircle2 className="h-4 w-4 text-emerald-400" />;
    if (type === 'REPORT_EXPORTED') return <FileText className="h-4 w-4 text-blue-400" />;

    switch (severity?.toUpperCase()) {
      case 'CRITICAL':
        return <ShieldAlert className="h-4 w-4 text-red-500" />;
      case 'HIGH':
        return <AlertTriangle className="h-4 w-4 text-amber-400" />;
      case 'MEDIUM':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      default:
        return <Info className="h-4 w-4 text-sky-400" />;
    }
  };

  const getSeverityBadgeClass = (severity?: string) => {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'HIGH':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'MEDIUM':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-extrabold tracking-tight text-foreground">Notifications & Alerts</h3>
          {unreadCount > 0 && (
            <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-red-400 border border-red-500/30">
              {unreadCount} unread
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {notifications.length > 0 && (
            <>
              <button
                onClick={onMarkAllAsRead}
                title="Mark all as read"
                className="p-1 rounded-lg text-slate-400 hover:text-foreground hover:bg-accent transition text-xs flex items-center gap-1"
              >
                <CheckCheck className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={onClearAll}
                title="Clear notifications"
                className="p-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition text-xs"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-foreground hover:bg-accent transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-80 overflow-y-auto divide-y divide-border/40 pr-1 space-y-1">
        {notifications.length === 0 ? (
          <div className="py-8 text-center space-y-1">
            <CheckCircle2 className="h-8 w-8 text-emerald-500/50 mx-auto" />
            <p className="text-xs font-semibold text-foreground">All Clear!</p>
            <p className="text-[11px] text-slate-400">No active security alerts or notifications.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => onNotificationClick && onNotificationClick(n)}
              className={`group py-3 px-2 rounded-xl transition cursor-pointer hover:bg-accent/40 flex items-start gap-3 ${
                !n.read ? 'bg-primary/5' : ''
              }`}
            >
              <div className="mt-0.5 flex-shrink-0">{getSeverityIcon(n.severity, n.type)}</div>

              <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-foreground truncate group-hover:text-primary transition">
                    {n.title}
                  </h4>
                  {n.severity && (
                    <span
                      className={`text-[9px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded border flex-shrink-0 ${getSeverityBadgeClass(
                        n.severity
                      )}`}
                    >
                      {n.severity}
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">{n.message}</p>

                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-0.5">
                  <span>{new Date(n.timestamp || n.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition text-primary font-semibold flex items-center gap-0.5">
                    View Details <ExternalLink className="h-2.5 w-2.5" />
                  </span>
                </div>
              </div>

              {!n.read && (
                <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5" title="Unread" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border pt-2 text-center">
        <a
          href="/dashboard"
          className="text-[11px] font-semibold text-primary hover:underline inline-flex items-center gap-1"
        >
          Open Security Dashboard &rarr;
        </a>
      </div>
    </div>
  );
};
