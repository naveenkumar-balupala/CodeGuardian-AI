import React from 'react';
import { History, CheckCircle, FileCode } from 'lucide-react';
import { ReviewHistoryItem } from '@/types/dashboard';

interface Props {
  reviews: ReviewHistoryItem[];
}

export const ReviewHistoryTable: React.FC<Props> = ({ reviews }) => {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-indigo-400" />
          <h3 className="text-base font-bold tracking-tight text-foreground">Security Review History</h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">Recent Audits</span>
      </div>

      <div className="space-y-3">
        {reviews.map((rev) => (
          <div key={rev.id} className="flex items-start justify-between rounded-xl border border-border/50 bg-background/50 p-3 hover:border-blue-500/40 transition">
            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-blue-500/10 p-1.5 text-blue-400">
                <FileCode className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">{rev.finding_title}</h4>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">{rev.rule_id} &bull; {rev.file_path}</p>
                {rev.comment && <p className="text-[11px] text-slate-300 italic mt-1">&ldquo;{rev.comment}&rdquo;</p>}
              </div>
            </div>

            <div className="text-right text-[11px]">
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                <CheckCircle className="h-3 w-3" /> {rev.new_status}
              </span>
              <span className="block text-[10px] text-slate-500 mt-1">{rev.auditor_name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
