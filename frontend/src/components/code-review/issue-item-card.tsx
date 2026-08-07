import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, Wrench, ChevronDown, ChevronUp, FileCode, Sparkles } from 'lucide-react';
import { ReviewIssueItem } from '@/types/code-review';

interface Props {
  issue: ReviewIssueItem;
}

export const IssueItemCard: React.FC<Props> = ({ issue }) => {
  const [showDiff, setShowDiff] = useState(false);

  const getToolColor = (tool: string) => {
    switch (tool) {
      case 'Semgrep': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'SonarQube': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Bandit': return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'ESLint': return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Pylint': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      default: return 'bg-accent text-slate-300 border-border';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'HIGH': return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'MEDIUM': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/40';
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card/60 p-5 shadow-sm space-y-4 hover:border-primary/40 transition">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/40 pb-3">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold font-mono border ${getToolColor(issue.tool)}`}>
            {issue.tool}
          </span>
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase font-mono border ${getSeverityBadge(issue.severity)}`}>
            {issue.severity}
          </span>
          <span className="text-xs font-mono font-medium text-slate-300 flex items-center gap-1">
            <FileCode className="h-3.5 w-3.5 text-slate-500" />
            {issue.file_path}:{issue.line_number}
          </span>
        </div>

        <span className="text-[10px] font-semibold uppercase text-slate-500 font-mono tracking-wider">
          {issue.type}
        </span>
      </div>

      {/* Code Snippet */}
      <div className="rounded-lg bg-background p-3 font-mono text-[11px] text-slate-300 border border-border/50 overflow-x-auto">
        <span className="text-[10px] text-slate-500 block mb-1">Source Snippet:</span>
        <code>{issue.code_snippet}</code>
      </div>

      {/* AI Explanation Box */}
      <div className="rounded-lg bg-primary/5 p-3.5 border border-primary/20 space-y-1.5 text-xs">
        <div className="flex items-center gap-1.5 text-primary font-bold">
          <Sparkles className="h-4 w-4" /> AI Explanation & Root Cause
        </div>
        <p className="text-slate-300 leading-relaxed">{issue.ai_explanation}</p>
        <p className="text-emerald-400 font-medium pt-1">💡 <strong className="font-semibold text-emerald-300">Suggestion:</strong> {issue.ai_suggestion}</p>
      </div>

      {/* Patch Diff Toggle */}
      {issue.patch_diff && (
        <div className="pt-1">
          <button
            onClick={() => setShowDiff(!showDiff)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition"
          >
            <Wrench className="h-3.5 w-3.5" />
            <span>{showDiff ? 'Hide Automated Patch Diff' : 'View Automated Patch Diff'}</span>
            {showDiff ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>

          {showDiff && (
            <pre className="mt-3 p-4 rounded-xl bg-background border border-border text-[11px] font-mono text-emerald-400 overflow-x-auto leading-relaxed">
              {issue.patch_diff}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};
