import React from 'react';
import { Github, GitBranch, ShieldCheck, AlertTriangle } from 'lucide-react';
import { RepositorySummary } from '@/types/dashboard';

interface Props {
  repositories: RepositorySummary[];
}

export const RepositoryStatusTable: React.FC<Props> = ({ repositories }) => {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold tracking-tight text-foreground">Monitored Repositories</h3>
        <a href="/repositories" className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
          Manage Repositories ({repositories.length}) &rarr;
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border/50 text-slate-400 uppercase font-semibold">
            <tr>
              <th className="pb-3 pl-2">Repository</th>
              <th className="pb-3">Default Branch</th>
              <th className="pb-3">Status</th>
              <th className="pb-3 text-right pr-2">Issues Detected</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {repositories.map((repo) => (
              <tr key={repo.id} className="hover:bg-accent/40 transition">
                <td className="py-3 pl-2 font-medium text-foreground flex items-center gap-2">
                  <Github className="h-4 w-4 text-slate-400" />
                  <span>{repo.full_name}</span>
                </td>
                <td className="py-3 text-slate-400 font-mono">
                  <span className="inline-flex items-center gap-1 bg-accent px-2 py-0.5 rounded text-[11px]">
                    <GitBranch className="h-3 w-3" /> {repo.branch}
                  </span>
                </td>
                <td className="py-3">
                  {repo.vulnerability_count === 0 ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="h-3 w-3" /> Clean
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-orange-400 font-semibold bg-orange-500/10 px-2 py-0.5 rounded-full">
                      <AlertTriangle className="h-3 w-3" /> Action Required
                    </span>
                  )}
                </td>
                <td className="py-3 text-right pr-2 font-bold font-mono text-slate-200">
                  {repo.vulnerability_count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
