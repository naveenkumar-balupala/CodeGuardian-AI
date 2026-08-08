'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { ReviewScoreCard } from '@/components/code-review/review-score-card';
import { IssueItemCard } from '@/components/code-review/issue-item-card';
import { CodeReviewService } from '@/services/code-review.service';
import { RepositoryService } from '@/services/repository.service';
import { Repository } from '@/types/repository';
import { CodeReviewResponse } from '@/types/code-review';
import { CheckCircle2, Play, Loader2, Filter, FolderGit2 } from 'lucide-react';

export default function CodeReviewPage() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepoId, setSelectedRepoId] = useState<string>('');
  const [review, setReview] = useState<CodeReviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);
  
  const [toolFilter, setToolFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');

  const [statusMessage, setStatusMessage] = useState<string | null>(null);

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

  const fetchReviewData = useCallback(async (repoId: string) => {
    try {
      setLoading(true);
      setStatusMessage(null);
      const res = await CodeReviewService.getLatestReview(repoId);
      setReview(res?.data || null);
    } catch {
      setReview(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedRepoId) {
      fetchReviewData(selectedRepoId);
    }
  }, [selectedRepoId, fetchReviewData]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleTriggerReview = async () => {
    if (!selectedRepoId) return;
    setReviewing(true);
    setStatusMessage(null);
    setErrorMessage(null);
    const startTime = Date.now();
    try {
      const res = await CodeReviewService.triggerReview(selectedRepoId);
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < 1200) {
        await new Promise((resolve) => setTimeout(resolve, 1200 - elapsedTime));
      }
      setReview(res.data);
      setStatusMessage(`Code Review successfully updated at ${new Date().toLocaleTimeString()}! Overall Score: ${res.data.overall_score}/100 (Grade: ${res.data.grade})`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Code review trigger failed. Please verify API backend is running on http://localhost:8000.');
    } finally {
      setReviewing(false);
    }
  };

  const filteredIssues = review?.issues.filter((issue) => {
    const matchesTool = toolFilter === 'ALL' || issue.tool === toolFilter;
    const matchesSeverity = severityFilter === 'ALL' || issue.severity === severityFilter;
    return matchesTool && matchesSeverity;
  }) || [];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <DashboardHeader />

        <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 md:px-8 space-y-8">
          {errorMessage && (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs font-semibold text-red-400 flex items-center justify-between shadow-sm animate-in fade-in duration-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-red-400" />
                <span>{errorMessage}</span>
              </div>
              <button onClick={() => setErrorMessage(null)} className="text-red-400/70 hover:text-red-400 text-xs">
                &times;
              </button>
            </div>
          )}
          {statusMessage && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs font-semibold text-emerald-400 flex items-center justify-between shadow-sm animate-in fade-in duration-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>{statusMessage}</span>
              </div>
              <button onClick={() => setStatusMessage(null)} className="text-emerald-400/70 hover:text-emerald-400 text-xs">
                &times;
              </button>
            </div>
          )}

          {/* Top Header & Repository Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-primary" />
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">AI Automated Code Review</h1>
              </div>
              <p className="text-slate-400 text-xs md:text-sm mt-1">
                Integrated static analyzers (Semgrep, SonarQube, Bandit, ESLint, Pylint) with AI explanations & patch diffs
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
                onClick={handleTriggerReview}
                disabled={reviewing || !selectedRepoId}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition shadow-lg shadow-primary/20"
              >
                {reviewing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-current" />}
                <span>{reviewing ? 'Running Code Review...' : 'Run Code Review'}</span>
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
              <p className="text-xs text-slate-400 mt-1 mb-4 max-w-sm">Connect a repository to run static analyzers and AI code review.</p>
              <Link href="/repositories" className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 transition">
                Go to Repositories &rarr;
              </Link>
            </div>
          ) : review ? (
            <div className="space-y-8">
              {/* Composite Score Card */}
              <ReviewScoreCard review={review} />

              {/* Filter Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-border bg-card/60 p-4 backdrop-blur">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Filter className="h-4 w-4 text-primary" />
                  <span className="font-semibold uppercase tracking-wider">Filter Tools:</span>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto text-xs w-full sm:w-auto">
                  {['ALL', 'Semgrep', 'SonarQube', 'Bandit', 'ESLint', 'Pylint'].map((tool) => (
                    <button
                      key={tool}
                      onClick={() => setToolFilter(tool)}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                        toolFilter === tool ? 'bg-primary text-primary-foreground' : 'bg-background border border-border text-slate-400'
                      }`}
                    >
                      {tool}
                    </button>
                  ))}
                </div>
              </div>

              {/* Issues List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold tracking-tight text-foreground">
                    Analyzed Issues & AI Explanations ({filteredIssues.length})
                  </h3>
                </div>

                {filteredIssues.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl border border-dashed border-border bg-card/40">
                    <p className="text-xs text-slate-400">No issues found matching the selected tool filter.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredIssues.map((issue) => (
                      <IssueItemCard key={issue.id} issue={issue} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl border border-dashed border-border bg-card/40 space-y-3">
              <CheckCircle2 className="h-10 w-10 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-foreground">No Code Review Yet</h3>
              <p className="text-xs text-slate-400">Click &quot;Run Code Review&quot; above to trigger static analysis.</p>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
