import React from 'react';
import { Layers, Activity, ShieldCheck, Copy, Sparkles } from 'lucide-react';
import { ArchitectureReportResponse } from '@/types/architecture';

interface Props {
  report: ArchitectureReportResponse;
}

export const ArchitectureScoreCard: React.FC<Props> = ({ report }) => {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <span className="text-xs text-slate-400 font-semibold uppercase">Architecture Classification</span>
          <div className="flex items-center gap-2 mt-1">
            <Layers className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-extrabold tracking-tight text-foreground">{report.pattern}</h2>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="block text-[10px] text-slate-500 font-semibold uppercase">Module Coupling Index</span>
            <span className="font-extrabold text-lg text-emerald-400 font-mono flex items-center justify-end gap-1 mt-0.5">
              <Activity className="h-4 w-4 text-emerald-400" /> {report.coupling_score} / 10.0
            </span>
          </div>
        </div>
      </div>

      {/* Principles Compliance Scores */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4">
          <span className="block text-[10px] text-blue-400 uppercase font-semibold">SOLID Compliance</span>
          <span className="font-extrabold text-2xl text-blue-400 font-mono mt-1 block">{report.solid_score}%</span>
        </div>

        <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-4">
          <span className="block text-[10px] text-indigo-400 uppercase font-semibold">DRY Principle</span>
          <span className="font-extrabold text-2xl text-indigo-400 font-mono mt-1 block">{report.dry_score}%</span>
        </div>

        <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-4">
          <span className="block text-[10px] text-purple-400 uppercase font-semibold">KISS Simplicity</span>
          <span className="font-extrabold text-2xl text-purple-400 font-mono mt-1 block">{report.kiss_score}%</span>
        </div>
      </div>
    </div>
  );
};
