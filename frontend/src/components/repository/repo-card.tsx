import React from 'react';
import { Github, GitBranch, FileCode, HardDrive, Trash2, GitCommit } from 'lucide-react';
import { Repository } from '@/types/repository';
import { RepoProgressBar } from './repo-progress-bar';

interface Props {
  repository: Repository;
  onDelete: (id: string) => void;
}

export const RepoCard: React.FC<Props> = ({ repository, onDelete }) => {
  const sizeMb = (repository.size_bytes / (1024 * 1024)).toFixed(2);

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition">
      <div>
        {/* Top Provider Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Github className="h-5 w-5 text-primary" />
            <span className="font-bold text-sm text-foreground">{repository.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-accent px-2.5 py-0.5 text-[10px] font-semibold text-slate-300 font-mono">
              {repository.provider}
            </span>
            <button
              onClick={() => onDelete(repository.id)}
              className="rounded-lg p-1 text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition"
              title="Delete Repository"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-400 font-mono">{repository.full_name}</p>
      </div>

      {/* Progress Bar & Status */}
      <div className="py-2 border-y border-border/40 my-2">
        <RepoProgressBar status={repository.processing_status} progress={repository.processing_progress} />
      </div>

      {/* Metadata Stats Grid */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs bg-background/50 p-2.5 rounded-xl border border-border/50">
        <div>
          <span className="block text-[10px] text-slate-500 uppercase font-semibold">Files</span>
          <span className="font-bold text-foreground font-mono flex items-center justify-center gap-1">
            <FileCode className="h-3 w-3 text-blue-400" /> {repository.file_count}
          </span>
        </div>
        <div>
          <span className="block text-[10px] text-slate-500 uppercase font-semibold">Size</span>
          <span className="font-bold text-foreground font-mono flex items-center justify-center gap-1">
            <HardDrive className="h-3 w-3 text-purple-400" /> {sizeMb} MB
          </span>
        </div>
        <div>
          <span className="block text-[10px] text-slate-500 uppercase font-semibold">Branch</span>
          <span className="font-bold text-foreground font-mono flex items-center justify-center gap-1">
            <GitBranch className="h-3 w-3 text-emerald-400" /> {repository.default_branch}
          </span>
        </div>
      </div>

      {/* Last Commit Info */}
      {repository.last_commit_hash && (
        <div className="text-[11px] text-slate-400 pt-1">
          <div className="flex items-center gap-1 font-mono text-[10px] text-slate-500">
            <GitCommit className="h-3 w-3 text-primary" /> {repository.last_commit_hash.slice(0, 7)}
          </div>
          <p className="truncate text-slate-300 font-medium mt-0.5">&ldquo;{repository.last_commit_message}&rdquo;</p>
        </div>
      )}
    </div>
  );
};
