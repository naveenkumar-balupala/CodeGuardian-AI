import React from 'react';
import { ShieldCheck, TrendingUp } from 'lucide-react';
import { ProjectScoreMetric } from '@/types/dashboard';

interface Props {
  metric: ProjectScoreMetric;
}

export const ProjectScoreCard: React.FC<Props> = ({ metric }) => {
  const diff = metric.score - metric.previous_score;

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Security Score</span>
        <div className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-400">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>{metric.grade} Grade</span>
        </div>
      </div>

      <div className="my-4 flex items-baseline justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-extrabold tracking-tight text-foreground">{metric.score}</span>
          <span className="text-sm font-medium text-slate-400">/ 100</span>
        </div>

        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
          <TrendingUp className="h-4 w-4" />
          <span>+{diff} pts</span>
        </div>
      </div>

      <div className="text-xs font-medium text-slate-400 border-t border-border/50 pt-3">
        Status: <span className="text-foreground font-semibold">{metric.status_label}</span>
      </div>
    </div>
  );
};
