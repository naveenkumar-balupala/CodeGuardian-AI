import React from 'react';
import { Cpu, Database, Server, Terminal, Layers, FileCheck, CheckCircle2, ShieldAlert } from 'lucide-react';
import { RepositoryAnalysis } from '@/types/scanner';

interface Props {
  analysis: RepositoryAnalysis;
}

export const ScannerSummaryCard: React.FC<Props> = ({ analysis }) => {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <span className="text-xs text-slate-400 uppercase font-semibold">Detected Architecture</span>
          <div className="flex items-center gap-2 mt-1">
            <Layers className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-bold tracking-tight text-foreground">{analysis.architecture_style}</h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {analysis.has_swagger && (
            <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-semibold">
              <CheckCircle2 className="h-3.5 w-3.5" /> Swagger / OpenAPI Specs Detected
            </span>
          )}
        </div>
      </div>

      {/* Language Breakdown */}
      <div>
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block">Language Breakdown</span>
        <div className="w-full bg-slate-800 rounded-full h-3 flex overflow-hidden mb-3">
          <div style={{ width: `${analysis.languages['Python'] || 50}%` }} className="bg-blue-500"></div>
          <div style={{ width: `${analysis.languages['TypeScript'] || 40}%` }} className="bg-indigo-500"></div>
          <div style={{ width: `${analysis.languages['SQL'] || 5}%` }} className="bg-purple-500"></div>
          <div style={{ width: `${analysis.languages['HTML/CSS'] || 5}%` }} className="bg-emerald-500"></div>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
          {Object.entries(analysis.languages).map(([lang, pct]) => (
            <span key={lang} className="flex items-center gap-1.5 text-slate-300">
              <span className="h-2 w-2 rounded-full bg-primary"></span> {lang} ({pct}%)
            </span>
          ))}
        </div>
      </div>

      {/* Tech Stack Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        <div className="rounded-xl border border-border/50 bg-background/50 p-4">
          <div className="flex items-center gap-2 mb-2 text-primary">
            <Cpu className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">Frameworks</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {analysis.frameworks.map((fw) => (
              <span key={fw} className="bg-accent px-2 py-0.5 rounded text-[11px] font-mono text-slate-300">
                {fw}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-background/50 p-4">
          <div className="flex items-center gap-2 mb-2 text-purple-400">
            <Database className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">Databases</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {analysis.databases.map((db) => (
              <span key={db} className="bg-accent px-2 py-0.5 rounded text-[11px] font-mono text-slate-300">
                {db}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-background/50 p-4">
          <div className="flex items-center gap-2 mb-2 text-emerald-400">
            <Terminal className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">CI/CD & Tools</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {analysis.ci_cd_tools.map((ci) => (
              <span key={ci} className="bg-accent px-2 py-0.5 rounded text-[11px] font-mono text-slate-300">
                {ci}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-background/50 p-4">
          <div className="flex items-center gap-2 mb-2 text-indigo-400">
            <Server className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">Docker Configs</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {analysis.docker_configs.map((d) => (
              <span key={d} className="bg-accent px-2 py-0.5 rounded text-[11px] font-mono text-slate-300">
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
