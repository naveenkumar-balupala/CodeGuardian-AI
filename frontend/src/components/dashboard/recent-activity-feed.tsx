import React from 'react';
import { Activity, ShieldCheck, UserCheck, Bot } from 'lucide-react';
import { ActivityItem } from '@/types/dashboard';

interface Props {
  activities: ActivityItem[];
}

export const RecentActivityFeed: React.FC<Props> = ({ activities }) => {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-emerald-400" />
          <h3 className="text-base font-bold tracking-tight text-foreground">Recent Activity Stream</h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">Live Timeline</span>
      </div>

      <div className="relative border-l border-border/60 pl-4 space-y-4 ml-2">
        {activities.map((act) => (
          <div key={act.id} className="relative group">
            <div className="absolute -left-[21px] top-1 h-3.5 w-3.5 rounded-full border-2 border-card bg-primary"></div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground">{act.action}</span>
              <span className="text-[10px] text-slate-500 font-mono">Just now</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{act.details}</p>
            <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1">
              {act.user_name.includes('Bot') ? <Bot className="h-3 w-3 text-blue-400" /> : <UserCheck className="h-3 w-3 text-emerald-400" />}
              <span>{act.user_name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
