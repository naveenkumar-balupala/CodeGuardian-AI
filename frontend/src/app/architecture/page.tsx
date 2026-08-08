'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { ArchitectureScoreCard } from '@/components/architecture/architecture-score-card';
import { MermaidDiagramViewer } from '@/components/architecture/mermaid-diagram-viewer';
import { PrinciplesBreakdown } from '@/components/architecture/principles-breakdown';
import { ArchitectureService } from '@/services/architecture.service';
import { RepositoryService } from '@/services/repository.service';
import { Repository } from '@/types/repository';
import { ArchitectureReportResponse } from '@/types/architecture';
import { Layers, Play, Loader2, FolderGit2 } from 'lucide-react';

export default function ArchitecturePage() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepoId, setSelectedRepoId] = useState<string>('');
  const [report, setReport] = useState<ArchitectureReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    RepositoryService.listRepositories()
      .then((res) => {
        const repoList = res?.data || [];
        setRepositories(repoList);
        if (repoList.length > 0) {
          setSelectedRepoId(repoList[0].id);
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const fetchReportData = useCallback(async (repoId: string) => {
    try {
      setLoading(true);
      const res = await ArchitectureService.getLatestReport(repoId);
      setReport(res?.data || null);
    } catch {
      setReport(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedRepoId) {
      fetchReportData(selectedRepoId);
    }
  }, [selectedRepoId, fetchReportData]);

  const handleTriggerScan = async () => {
    if (!selectedRepoId) return;
    setScanning(true);
    try {
      const res = await ArchitectureService.triggerScan(selectedRepoId);
      setReport(res.data);
    } catch (err: any) {
      alert(err.message || 'Architecture scan failed.');
    } finally {
      setScanning(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <DashboardHeader />

        <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 md:px-8 space-y-8">
          {/* Header Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="h-6 w-6 text-primary" />
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Architecture Analyzer & Visualizer</h1>
              </div>
              <p className="text-slate-400 text-xs md:text-sm mt-1">
                Automated Dependency Graph, Mermaid Diagrams, Module Coupling, SOLID/DRY/KISS Violations & Design Patterns
              </p>
            </div>

            <div className="flex items-center gap-3">
              {repositories.length > 0 && (
                <select
                  value={selectedRepoId}
                  onChange={(e) => setSelectedRepoId(e.target.value)}
                  className="rounded-xl border border-border bg-card px-3 py-2 text-xs text-foreground font-semibold focus:border-primary focus:outline-none"
                >
                  {repositories.map((repo) => (
                    <option key={repo.id} value={repo.id}>
                      {repo.full_name}
                    </option>
                  ))}
                </select>
              )}

              <button
                onClick={handleTriggerScan}
                disabled={scanning || !selectedRepoId}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition shadow-lg shadow-primary/20"
              >
                {scanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-current" />}
                <span>{scanning ? 'Analyzing Architecture...' : 'Run Architecture Scan'}</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex h-96 items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : repositories.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border bg-card/40">
              <FolderGit2 className="h-12 w-12 text-slate-600 mb-3" />
              <h3 className="text-lg font-bold text-foreground">No Repositories Connected</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4 max-w-sm">Connect a repository first to analyze architectural patterns and dependency graphs.</p>
              <Link href="/repositories" className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 transition">
                Go to Repositories &rarr;
              </Link>
            </div>
          ) : report ? (
            <div className="space-y-8">
              {/* Pattern & Coupling Score Card */}
              <ArchitectureScoreCard report={report} />

              {/* Mermaid Dependency Graph Viewer */}
              <MermaidDiagramViewer mermaidDiagram={report.mermaid_diagram} />

              {/* Principles Breakdown (SOLID, DRY, KISS, Design Patterns) */}
              <PrinciplesBreakdown report={report} />
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl border border-dashed border-border bg-card/40 space-y-3">
              <Layers className="h-10 w-10 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-foreground">No Architecture Report Yet</h3>
              <p className="text-xs text-slate-400">Click &quot;Run Architecture Scan&quot; above to generate a full module coupling analysis and dependency graph.</p>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
