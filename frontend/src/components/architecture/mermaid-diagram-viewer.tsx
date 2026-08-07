import React, { useState } from 'react';
import { Network, Copy, Check, Code2 } from 'lucide-react';

interface Props {
  mermaidDiagram: string;
}

export const MermaidDiagramViewer: React.FC<Props> = ({ mermaidDiagram }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(mermaidDiagram);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Network className="h-5 w-5 text-primary" />
          <h3 className="text-base font-bold tracking-tight text-foreground">System Component Architecture & Dependency Graph</h3>
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-foreground hover:bg-accent transition"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
          <span>{copied ? 'Copied Mermaid Syntax' : 'Copy Mermaid Syntax'}</span>
        </button>
      </div>

      <div className="rounded-xl border border-border bg-background p-4 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed shadow-inner">
        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-sans font-bold uppercase mb-2 border-b border-border/40 pb-1">
          <Code2 className="h-3.5 w-3.5 text-primary" /> Generated Mermaid Diagram Specification
        </div>
        <pre>{mermaidDiagram}</pre>
      </div>
    </div>
  );
};
