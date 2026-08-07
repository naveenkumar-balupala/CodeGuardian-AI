import React from 'react';
import { Loader2, ShieldCheck, AlertCircle, FileCheck, Database, HardDriveDownload } from 'lucide-react';

interface Props {
  status: string;
  progress: number;
  error?: string;
}

export const RepoProgressBar: React.FC<Props> = ({ status, progress, error }) => {
  if (status === 'COMPLETED') {
    return (
      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full w-fit">
        <ShieldCheck className="h-3.5 w-3.5" /> Ready for Scanning
      </div>
    );
  }

  if (status === 'FAILED') {
    return (
      <div className="flex items-center gap-1.5 text-xs font-semibold text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full w-fit">
        <AlertCircle className="h-3.5 w-3.5" /> Failed: {error || 'Processing Error'}
      </div>
    );
  }

  let stageLabel = 'Queued';
  let Icon = Loader2;

  if (status === 'CLONING') {
    stageLabel = 'Cloning Git Repository...';
    Icon = HardDriveDownload;
  } else if (status === 'VIRUS_CHECK') {
    stageLabel = 'Running Malware & Safety Check...';
    Icon = FileCheck;
  } else if (status === 'INDEXING') {
    stageLabel = 'Indexing Source Code Files...';
    Icon = Database;
  }

  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center justify-between text-[11px] font-medium text-slate-300">
        <span className="flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5 animate-spin text-primary" />
          {stageLabel}
        </span>
        <span className="font-mono text-primary">{progress}%</span>
      </div>

      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};
