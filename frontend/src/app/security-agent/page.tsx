'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { SecurityRiskScoreCard } from '@/components/security-agent/security-risk-score-card';
import { OWASPChartsPanel } from '@/components/security-agent/owasp-charts-panel';
import { VulnerabilityFindingCard } from '@/components/security-agent/vulnerability-finding-card';
import { SecurityAgentService } from '@/services/security-agent.service';
import { RepositoryService } from '@/services/repository.service';
import { Repository } from '@/types/repository';
import { SecurityAgentReportResponse } from '@/types/security-agent';
import { ShieldAlert, Play, Loader2, Filter, FolderGit2 } from 'lucide-react';

export default function SecurityAgentPage() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepoId, setSelectedRepoId] = useState<string>('');
  const [report, setReport] = useState<SecurityAgentReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);

  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');

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
      const res = await SecurityAgentService.getLatestReport(repoId);
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
      const res = await SecurityAgentService.triggerScan(selectedRepoId);
      setReport(res.data);
    } catch (err: any) {
      alert(err.message || 'Security Agent scan failed.');
    } finally {
      setScanning(false);
    }
  };

  const filteredFindings = report?.findings.filter((finding) => {
    const matchesCategory = categoryFilter === 'ALL' || finding.category === categoryFilter;
    const matchesSeverity = severityFilter === 'ALL' || finding.severity === severityFilter;
    return matchesCategory && matchesSeverity;
  }) || [];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <DashboardHeader />

        <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 md:px-8 space-y-8">
          {/* Header Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-6 w-6 text-red-500" />
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Security Agent Engine</h1>
              </div>
              <p className="text-slate-400 text-xs md:text-sm mt-1">
                Automated detection of SQL Injection, Secrets, XSS, JWT flaws, CSRF, Dependencies & OWASP Top 10 with CVSS v3.1 scoring
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
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 text-white px-4 py-2.5 text-xs font-semibold hover:bg-red-700 disabled:opacity-50 transition shadow-lg shadow-red-500/20"
              >
                {scanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4 fill-current" />}
                <span>{scanning ? 'Running SAST Scan...' : 'Run Security Agent Scan'}</span>
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
              <p className="text-xs text-slate-400 mt-1 mb-4 max-w-sm">Connect a repository to perform SAST security audits and CVSS vulnerability scoring.</p>
              <Link href="/repositories" className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 transition">
                Go to Repositories &rarr;
              </Link>
            </div>
          ) : report ? (
            <div className="space-y-8">
              {/* Composite Risk Score Card */}
              <SecurityRiskScoreCard report={report} />

              {/* Interactive Visual Charts Panel */}
              <OWASPChartsPanel report={report} />

              {/* Filter Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-border bg-card/60 p-4 backdrop-blur">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Filter className="h-4 w-4 text-primary" />
                  <span className="font-semibold uppercase tracking-wider">Vulnerability Category:</span>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto text-xs w-full sm:w-auto">
                  {['ALL', 'SQL_INJECTION', 'SECRETS', 'XSS', 'JWT', 'CSRF', 'DEPENDENCY'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                        categoryFilter === cat ? 'bg-primary text-primary-foreground' : 'bg-background border border-border text-slate-400'
                      }`}
                    >
                      {cat.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Findings List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold tracking-tight text-foreground">
                    Detected Vulnerabilities ({filteredFindings.length})
                  </h3>
                </div>

                {filteredFindings.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl border border-dashed border-border bg-card/40">
                    <p className="text-xs text-slate-400">No security findings matching the selected filter.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredFindings.map((finding) => (
                      <VulnerabilityFindingCard key={finding.id} finding={finding} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl border border-dashed border-border bg-card/40 space-y-3">
              <ShieldAlert className="h-10 w-10 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-foreground">No Security Report Yet</h3>
              <p className="text-xs text-slate-400">Click &quot;Run Security Agent Scan&quot; above to start scanning for vulnerabilities.</p>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
