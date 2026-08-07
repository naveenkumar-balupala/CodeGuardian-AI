import React from 'react';
import { ShieldAlert, AlertCircle, ShieldCheck } from 'lucide-react';
import { SecurityAgentReportResponse } from '@/types/security-agent';

interface Props {
  report: SecurityAgentReportResponse;
}

export const SecurityRiskScoreCard: React.FC<Props> = ({ report }) => {
  const getBadgeStyle = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'HIGH': return 'bg-orange-500/10 text-orange-400 border-orange-500/30';
      case 'MEDIUM': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      default: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 text-white shadow-lg">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase">Composite Risk Score</span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground">{report.risk_score}</h2>
              <span className="text-xs text-slate-500 font-mono">/ 100</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wider uppercase border ${getBadgeStyle(report.risk_level)}`}>
            Risk Level: {report.risk_level}
          </span>
        </div>
      </div>

      {/* CVSS Severity Breakdown Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-3">
          <span className="block text-[10px] text-red-400 uppercase font-semibold">Critical Vulnerabilities</span>
          <span className="font-extrabold text-xl text-red-400 font-mono">{report.critical_count}</span>
        </div>
        <div className="rounded-xl border border-orange-500/30 bg-orange-500/5 p-3">
          <span className="block text-[10px] text-orange-400 uppercase font-semibold">High Vulnerabilities</span>
          <span className="font-extrabold text-xl text-orange-400 font-mono">{report.high_count}</span>
        </div>
        <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-3">
          <span className="block text-[10px] text-yellow-400 uppercase font-semibold">Medium Vulnerabilities</span>
          <span className="font-extrabold text-xl text-yellow-400 font-mono">{report.medium_count}</span>
        </div>
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3">
          <span className="block text-[10px] text-emerald-400 uppercase font-semibold">Low Vulnerabilities</span>
          <span className="font-extrabold text-xl text-emerald-400 font-mono">{report.low_count}</span>
        </div>
      </div>
    </div>
  );
};
