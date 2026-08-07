import React from 'react';
import { BarChart3, PieChart, ShieldAlert } from 'lucide-react';
import { SecurityAgentReportResponse } from '@/types/security-agent';

interface Props {
  report: SecurityAgentReportResponse;
}

export const OWASPChartsPanel: React.FC<Props> = ({ report }) => {
  const { category_breakdown, cvss_trend } = report.chart_dataset;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart 1: OWASP Category Breakdown */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur space-y-4">
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-bold tracking-tight text-foreground">OWASP Category Distribution</h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400 font-semibold">SAST Rules Matrix</span>
        </div>

        <div className="space-y-3 pt-2">
          {category_breakdown.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">{item.name}</span>
                <span className="font-mono text-xs font-bold text-foreground">{item.count} Finding(s)</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${item.count * 30}%`, backgroundColor: item.color }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart 2: CVSS Score Breakdown */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur space-y-4">
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <div className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-indigo-400" />
            <h3 className="text-sm font-bold tracking-tight text-foreground">CVSS v3.1 Base Scores Trend</h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400 font-semibold">Severity Spectrum</span>
        </div>

        <div className="space-y-3 pt-2">
          {cvss_trend.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between bg-background/50 p-2.5 rounded-xl border border-border/40 text-xs">
              <div className="flex items-center gap-2">
                <ShieldAlert className={`h-4 w-4 ${item.score >= 9.0 ? 'text-red-400' : item.score >= 7.0 ? 'text-orange-400' : 'text-yellow-400'}`} />
                <span className="font-semibold text-slate-200">{item.label}</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <span className="text-[10px] text-slate-500 uppercase">CVSS Score</span>
                <span className={`font-extrabold text-xs px-2 py-0.5 rounded border ${
                  item.score >= 9.0 ? 'bg-red-500/10 text-red-400 border-red-500/30' : item.score >= 7.0 ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                }`}>
                  {item.score}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
