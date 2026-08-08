'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { AgentGraphVisualizer } from '@/components/ai/agent-graph-visualizer';
import { AIChatDrawer } from '@/components/ai/ai-chat-drawer';
import { AIAgentsService } from '@/services/ai-agents.service';
import { RepositoryService } from '@/services/repository.service';
import { Repository } from '@/types/repository';
import { OrchestrateResponse } from '@/types/ai-agents';
import { Cpu, Play, MessageSquare, ShieldCheck, Layers, FileText, Sparkles, Loader2, FolderGit2 } from 'lucide-react';

export default function AIAuditPage() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepoId, setSelectedRepoId] = useState<string>('');
  const [auditData, setAuditData] = useState<OrchestrateResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    RepositoryService.listRepositories()
      .then((res) => {
        const repoList = res?.data || [];
        setRepositories(repoList);
        if (repoList.length > 0) {
          setSelectedRepoId(repoList[0].id);
        }
      })
      .catch(() => {
        // Handle error gracefully
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRunAudit = async () => {
    if (!selectedRepoId) return;
    setIsRunning(true);
    setErrorMessage(null);
    try {
      const response = await AIAgentsService.orchestrateAudit(selectedRepoId);
      setAuditData(response?.data || null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Multi-agent orchestration failed. Please verify API backend is running on http://localhost:8000.');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <DashboardHeader />

        <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 md:px-8 space-y-8">
          {errorMessage && (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs font-semibold text-red-400 flex items-center justify-between shadow-sm animate-in fade-in duration-300">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-red-400" />
                <span>{errorMessage}</span>
              </div>
              <button onClick={() => setErrorMessage(null)} className="text-red-400/70 hover:text-red-400 text-xs">
                &times;
              </button>
            </div>
          )}
          {/* Header Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Cpu className="h-6 w-6 text-primary" />
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">LangGraph Multi-Agent Security Audit</h1>
              </div>
              <p className="text-slate-400 text-xs md:text-sm mt-1">Orchestrating 11 specialized subagents for SAST, Architecture, ORM, Performance & Remediation</p>
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
                onClick={handleRunAudit}
                disabled={isRunning || !selectedRepoId}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition shadow-lg shadow-primary/20"
              >
                {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-current" />}
                <span>{isRunning ? 'Running LangGraph Engine...' : 'Run Multi-Agent Audit'}</span>
              </button>

              <button
                onClick={() => setIsChatOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-accent transition"
              >
                <MessageSquare className="h-4 w-4 text-primary" /> Chat Assistant
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
              <p className="text-xs text-slate-400 mt-1 mb-4 max-w-sm">Connect a repository to orchestrate multi-agent security audits.</p>
              <Link href="/repositories" className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 transition">
                Go to Repositories &rarr;
              </Link>
            </div>
          ) : (
            <>
              {/* Interactive Agent Graph Visualizer */}
              <AgentGraphVisualizer
                completedNodes={auditData?.completed_nodes || []}
                isRunning={isRunning}
              />

              {/* Audit Results View */}
              {auditData && (
                <div className="space-y-8">
                  {/* Agent Telemetry Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur space-y-2">
                      <div className="flex items-center justify-between text-red-400">
                        <ShieldCheck className="h-5 w-5" />
                        <span className="text-[10px] font-bold uppercase font-mono bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30">SAST Findings</span>
                      </div>
                      <h3 className="text-2xl font-extrabold text-foreground">{auditData.security_data?.critical_vulnerabilities || 0} Critical</h3>
                      <p className="text-xs text-slate-400">SQL Injections & Hardcoded Secret fallbacks</p>
                    </div>

                    <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur space-y-2">
                      <div className="flex items-center justify-between text-purple-400">
                        <Layers className="h-5 w-5" />
                        <span className="text-[10px] font-bold uppercase font-mono bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30">Architecture Isolation</span>
                      </div>
                      <h3 className="text-2xl font-extrabold text-foreground">{auditData.architecture_data?.layer_isolation_score || 92}/100</h3>
                      <p className="text-xs text-slate-400">Layered Monorepo pattern with isolated boundaries</p>
                    </div>

                    <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur space-y-2">
                      <div className="flex items-center justify-between text-emerald-400">
                        <Sparkles className="h-5 w-5" />
                        <span className="text-[10px] font-bold uppercase font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">Remediation Diffs</span>
                      </div>
                      <h3 className="text-2xl font-extrabold text-foreground">{auditData.recommendations_data?.prioritized_remediations?.length || 0} Actionable Fixes</h3>
                      <p className="text-xs text-slate-400">Generated code patches ready for review</p>
                    </div>
                  </div>

                  {/* Code Patch Diffs Section */}
                  {auditData.recommendations_data?.suggested_patch_diffs && (
                    <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur space-y-4">
                      <div className="flex items-center gap-2 border-b border-border pb-3">
                        <Sparkles className="h-5 w-5 text-amber-400" />
                        <h3 className="text-base font-bold tracking-tight text-foreground">Recommendation Agent Automated Patch Diffs</h3>
                      </div>

                      {auditData.recommendations_data.suggested_patch_diffs.map((diffItem: any, idx: number) => (
                        <div key={idx} className="space-y-2">
                          <span className="text-xs font-mono font-semibold text-primary">{diffItem.file}</span>
                          <pre className="p-4 rounded-xl bg-background border border-border text-[11px] font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                            {diffItem.diff}
                          </pre>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Executive Summary Markdown Report */}
                  <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur space-y-4">
                    <div className="flex items-center gap-2 border-b border-border pb-3">
                      <FileText className="h-5 w-5 text-indigo-400" />
                      <h3 className="text-base font-bold tracking-tight text-foreground">Report Agent Executive Security Audit Report</h3>
                    </div>
                    <div className="prose prose-invert max-w-none text-xs leading-relaxed font-mono whitespace-pre-wrap bg-background/50 p-4 rounded-xl border border-border/50 text-slate-300">
                      {auditData.report_data?.executive_summary_md}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Chat Drawer */}
          <AIChatDrawer isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </main>
      </div>
    </ProtectedRoute>
  );
}
