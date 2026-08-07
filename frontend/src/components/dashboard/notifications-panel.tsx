import React from 'react';
import { Bell, AlertOctagon, Sparkles, CheckCircle2 } from 'lucide-react';
import { NotificationAlert } from '@/types/dashboard';

interface Props {
  notifications: NotificationAlert[];
}

export const NotificationsPanel: React.FC<Props> = ({ notifications }) => {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-yellow-400" />
          <h3 className="text-base font-bold tracking-tight text-foreground">Security Alerts & Notifications</h3>
        </div>
        <span className="text-xs text-primary font-medium hover:underline cursor-pointer">Mark all as read</span>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => {
          let IconComponent = Bell;
          let iconColor = 'text-blue-400';

          if (n.severity === 'CRITICAL') {
            IconComponent = AlertOctagon;
            iconColor = 'text-red-400';
          } else if (n.severity === 'MEDIUM') {
            IconComponent = Sparkles;
            iconColor = 'text-purple-400';
          } else if (n.severity === 'INFO') {
            IconComponent = CheckCircle2;
            iconColor = 'text-emerald-400';
          }

          return (
            <div
              key={n.id}
              className={`flex items-start gap-3 rounded-xl border p-3 transition ${
                n.read ? 'border-border/40 bg-background/30 opacity-75' : 'border-border bg-card/80 shadow-sm'
              }`}
            >
              <div className={`mt-0.5 rounded-lg bg-accent p-1.5 ${iconColor}`}>
                <IconComponent className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-foreground">{n.title}</h4>
                  <span className="text-[10px] text-slate-500 font-mono">Recent</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{n.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
