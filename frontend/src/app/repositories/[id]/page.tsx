'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { ScannerSummaryCard } from '@/components/repository/scanner-summary-card';
import { DependenciesList } from '@/components/repository/dependencies-list';
import { RepositoryService } from '@/services/repository.service';
import { ScannerService } from '@/services/scanner.service';
import { Repository } from '@/types/repository';
import { RepositoryAnalysis } from '@/types/scanner';
import { Play, Loader2, FileText, ArrowLeft, ShieldCheck, Github } from 'lucide-react';

export default function RepositoryDetailPage() {
  const params = useParams();
  const repoId = params.id as string;

  const [repository, setRepository] = useState<Repository | null>(null);
  const [analysis, setAnalysis] = useState<RepositoryAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [repoResp, analysisResp] = await Promise.all([
        RepositoryService.getRepository(repoId),
        ScannerService.getAnalysis(repoId),
      ]);
      setRepository(repoResp.data);
      setAnalysis(analysisResp.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load repository details.');
    } finally {
      setLoading(false);
    }
  }, [repoId]);

  useEffect(() => {
    if (repoId) loadData();
  }, [repoId, loadData]);

  const handleTriggerScan = async () => {
    try {
      setScanning(true);
      const response = await ScannerService.triggerScan(repoId);
      setAnalysis(response.data);
    } catch (err: any) {
      alert(err.message || 'Scan trigger failed.');
    } finally {
      setScanning(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <DashboardHeader />

        <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 md:px-8 space-y-8">
          {/* Back Button & Top Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <a href="/repositories" className="rounded-xl border border-border bg-card p-2 text-slate-400 hover:text-foreground hover:bg-accent transition">
                <ArrowLeft className="h-4 w-4" />
              </a>
              <div>
                <div className="flex items-center gap-2">
                  <Github className="h-5 w-5 text-primary" />
                  <h1 className="text-2xl font-extrabold tracking-tight">{repository?.full_name || 'Repository Analysis'}</h1>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Automated Technology Stack, Framework & Architecture Inspection</p>
              </div>
            </div>

            <button
              onClick={handleTriggerScan}
              disabled={scanning}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition shadow-lg shadow-primary/20"
            >
              {scanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-current" />}
              <span>{scanning ? 'Scanning Codebase...' : 'Re-Run Tech Scan'}</span>
            </button>
          </div>

          {loading ? (
            <div className="flex h-96 items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-red-500/50 bg-red-500/10 text-center">
              <ShieldCheck className="h-10 w-10 text-red-400 mb-2" />
              <h3 className="text-lg font-bold text-red-300">Analysis Failed</h3>
              <p className="text-xs text-slate-400 mt-1">{error}</p>
            </div>
          ) : analysis ? (
            <div className="space-y-8">
              {/* Tech Stack & Architecture Overview Card */}
              <ScannerSummaryCard analysis={analysis} />

              {/* Dependencies List Component */}
              <DependenciesList dependencies={analysis.dependencies} />

              {/* Executive Summary Markdown Report */}
              <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur space-y-4">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                  <FileText className="h-5 w-5 text-indigo-400" />
                  <h3 className="text-base font-bold tracking-tight text-foreground">Executive Architecture Summary Report</h3>
                </div>
                <div className="prose prose-invert max-w-none text-xs leading-relaxed font-mono whitespace-pre-wrap bg-background/50 p-4 rounded-xl border border-border/50 text-slate-300">
                  {analysis.summary_report}
                </div>
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </ProtectedRoute>
  );
}
