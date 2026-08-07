import React from 'react';
import { Award, Gauge, Activity, FileMinus, Tag, AlertCircle } from 'lucide-react';
import { CodeReviewResponse } from '@/types/code-review';

interface Props {
  review: CodeReviewResponse;
}

export const ReviewScoreCard: React.FC<Props> = ({ review }) => {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur space-y-6">
      {/* Score Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg font-black text-2xl">
            {review.grade}
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Composite Code Quality Score</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground">{review.overall_score}</h2>
              <span className="text-xs text-slate-500 font-mono">/ 100</span>
            </div>
          </div>
        </div>

        {/* Quality Metrics Gauge Summary */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="block text-[10px] text-slate-500 font-semibold uppercase">Cyclomatic Complexity</span>
            <span className="font-bold text-sm text-foreground font-mono flex items-center justify-end gap-1 mt-0.5">
              <Gauge className="h-4 w-4 text-blue-400" /> {review.cyclomatic_complexity}
            </span>
          </div>

          <div className="text-right">
            <span className="block text-[10px] text-slate-500 font-semibold uppercase">Maintainability Index</span>
            <span className="font-bold text-sm text-foreground font-mono flex items-center justify-end gap-1 mt-0.5">
              <Activity className="h-4 w-4 text-emerald-400" /> {review.maintainability_index}%
            </span>
          </div>
        </div>
      </div>

      {/* Code Smell & Quality Telemetry Pills */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-border/50 bg-background/50 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-yellow-400">
            <FileMinus className="h-4 w-4" />
            <span className="text-xs font-semibold text-foreground">Dead Code</span>
          </div>
          <span className="font-mono font-bold text-xs bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded border border-yellow-500/20">
            {review.dead_code_count} issues
          </span>
        </div>

        <div className="rounded-xl border border-border/50 bg-background/50 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-400">
            <Tag className="h-4 w-4" />
            <span className="text-xs font-semibold text-foreground">Naming Violations</span>
          </div>
          <span className="font-mono font-bold text-xs bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded border border-indigo-500/20">
            {review.naming_violations_count} issues
          </span>
        </div>

        <div className="rounded-xl border border-border/50 bg-background/50 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-purple-400">
            <AlertCircle className="h-4 w-4" />
            <span className="text-xs font-semibold text-foreground">Code Smells</span>
          </div>
          <span className="font-mono font-bold text-xs bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20">
            {review.code_smells_count} issues
          </span>
        </div>
      </div>
    </div>
  );
};
