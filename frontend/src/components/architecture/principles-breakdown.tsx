import React from 'react';
import { ShieldAlert, Sparkles, FileCode, CheckCircle2, Cpu, Wrench } from 'lucide-react';
import { ArchitectureReportResponse } from '@/types/architecture';

interface Props {
  report: ArchitectureReportResponse;
}

export const PrinciplesBreakdown: React.FC<Props> = ({ report }) => {
  const allViolations = [
    ...report.solid_violations,
    ...report.dry_violations,
    ...report.kiss_violations,
  ];

  return (
    <div className="space-y-8">
      {/* Design Patterns & Module Coupling Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Detected Design Patterns */}
        <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur space-y-4">
          <div className="flex items-center gap-2 border-b border-border pb-3">
            <Cpu className="h-5 w-5 text-primary" />
            <h3 className="text-base font-bold tracking-tight text-foreground">Recognized Design Patterns</h3>
          </div>

          <div className="space-y-2">
            {report.detected_patterns.map((pat, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-background/50 p-2.5 rounded-xl border border-border/40 text-xs font-semibold text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{pat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Module Coupling Metrics Table */}
        <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <FileCode className="h-5 w-5 text-indigo-400" />
              <h3 className="text-base font-bold tracking-tight text-foreground">Module Coupling (Fan-In / Fan-Out)</h3>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/50 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="pb-2">Module Name</th>
                  <th className="pb-2">Fan-In</th>
                  <th className="pb-2">Fan-Out</th>
                  <th className="pb-2 text-right">Instability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30 font-mono">
                {report.module_coupling.map((mc, idx) => (
                  <tr key={idx} className="hover:bg-accent/40 transition">
                    <td className="py-2 text-foreground font-semibold">{mc.module_name}</td>
                    <td className="py-2 text-emerald-400">{mc.fan_in}</td>
                    <td className="py-2 text-yellow-400">{mc.fan_out}</td>
                    <td className="py-2 text-right font-bold text-slate-300">{mc.instability}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SOLID, DRY & KISS Violations */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <ShieldAlert className="h-5 w-5 text-amber-400" />
          <h3 className="text-base font-bold tracking-tight text-foreground">
            SOLID, DRY & KISS Architectural Violations ({allViolations.length})
          </h3>
        </div>

        <div className="space-y-4">
          {allViolations.map((v, idx) => (
            <div key={idx} className="rounded-xl border border-border bg-background/50 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                    {v.principle} Violation
                  </span>
                  <h4 className="text-xs font-bold text-foreground">{v.title}</h4>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{v.file_path}:{v.line_number}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Architectural Refactoring Recommendations */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur space-y-4">
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="text-base font-bold tracking-tight text-foreground">AI Refactoring Recommendations</h3>
        </div>

        <div className="space-y-4">
          {report.ai_recommendations.map((rec, idx) => (
            <div key={idx} className="rounded-xl border border-border bg-background/50 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="h-5 w-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold font-mono">
                  {rec.priority}
                </span>
                <h4 className="text-xs font-bold text-foreground">{rec.title}</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{rec.description}</p>

              {rec.patch_diff && (
                <pre className="p-3 rounded-lg bg-card border border-border text-[11px] font-mono text-emerald-400 overflow-x-auto">
                  {rec.patch_diff}
                </pre>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
