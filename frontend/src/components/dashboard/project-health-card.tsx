import React from 'react';
import { AlertOctagon, ShieldAlert, AlertTriangle, Info } from 'lucide-react';
import { SeverityBreakdown } from '@/types/dashboard';

interface Props {
  breakdown: SeverityBreakdown;
}

export const ProjectHealthCard: React.FC<Props> = ({ breakdown }) => {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Vulnerability Health</span>
        <span className="text-xs text-slate-400 font-mono">{breakdown.total} Total Issues</span>
      </div>

      <div className="grid grid-cols-4 gap-2 text-center my-2">
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-2">
          <AlertOctagon className="h-4 w-4 text-red-400 mx-auto mb-1" />
          <span className="text-lg font-bold text-red-400">{breakdown.critical}</span>
          <span className="block text-[10px] uppercase text-slate-400 font-semibold">Critical</span>
        </div>

        <div className="rounded-lg bg-orange-500/10 border border-orange-500/20 p-2">
          <ShieldAlert className="h-4 w-4 text-orange-400 mx-auto mb-1" />
          <span className="text-lg font-bold text-orange-400">{breakdown.high}</span>
          <span className="block text-[10px] uppercase text-slate-400 font-semibold">High</span>
        </div>

        <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-2">
          <AlertTriangle className="h-4 w-4 text-yellow-400 mx-auto mb-1" />
          <span className="text-lg font-bold text-yellow-400">{breakdown.medium}</span>
          <span className="block text-[10px] uppercase text-slate-400 font-semibold">Medium</span>
        </div>

        <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-2">
          <Info className="h-4 w-4 text-blue-400 mx-auto mb-1" />
          <span className="text-lg font-bold text-blue-400">{breakdown.low + breakdown.info}</span>
          <span className="block text-[10px] uppercase text-slate-400 font-semibold">Low/Info</span>
        </div>
      </div>

      <div className="w-full bg-slate-800 rounded-full h-2 flex overflow-hidden mt-3">
        <div style={{ width: `${(breakdown.critical / breakdown.total) * 100}%` }} className="bg-red-500"></div>
        <div style={{ width: `${(breakdown.high / breakdown.total) * 100}%` }} className="bg-orange-500"></div>
        <div style={{ width: `${(breakdown.medium / breakdown.total) * 100}%` }} className="bg-yellow-500"></div>
        <div style={{ width: `${((breakdown.low + breakdown.info) / breakdown.total) * 100}%` }} className="bg-blue-500"></div>
      </div>
    </div>
  );
};
