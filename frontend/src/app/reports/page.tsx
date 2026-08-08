'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { ReportConfigModal } from '@/components/reports/report-config-modal';
import { ReportListTable } from '@/components/reports/report-list-table';
import { ReportsService } from '@/services/reports.service';
import { RepositoryService } from '@/services/repository.service';
import { Repository } from '@/types/repository';
import { ReportExportRequest, ReportExportResponse } from '@/types/reports';
import { FileText, FileSpreadsheet, Presentation, Plus, Loader2, DownloadCloud, FolderGit2 } from 'lucide-react';

export default function ReportsPage() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepoId, setSelectedRepoId] = useState<string>('');
  const [reports, setReports] = useState<ReportExportResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

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

  const fetchReports = useCallback(async (repoId: string) => {
    try {
      setLoading(true);
      const res = await ReportsService.listReports(repoId);
      setReports(res?.data || []);
    } catch {
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedRepoId) {
      fetchReports(selectedRepoId);
    }
  }, [selectedRepoId, fetchReports]);

  const handleGenerateReport = async (req: ReportExportRequest) => {
    if (!selectedRepoId) return;
    setGenerating(true);
    try {
      const res = await ReportsService.generateReport(selectedRepoId, req);
      if (res?.data) {
        setReports((prev) => [res.data, ...prev]);
      }
      setModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Report generation failed.');
    } finally {
      setGenerating(false);
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
                <DownloadCloud className="h-6 w-6 text-primary" />
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Report Export Engine</h1>
              </div>
              <p className="text-slate-400 text-xs md:text-sm mt-1">
                Generate professional PDF, Word (DOCX), and PowerPoint (PPTX) audit reports with custom branding
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
                onClick={() => setModalOpen(true)}
                disabled={!selectedRepoId}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition shadow-lg shadow-primary/20"
              >
                <Plus className="h-4 w-4" />
                <span>Export New Report</span>
              </button>
            </div>
          </div>

          {/* Quick Format Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5 space-y-2">
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                <FileText className="h-5 w-5" /> PDF Executive Document
              </div>
              <p className="text-xs text-slate-300">Comprehensive PDF report formatted with executive summaries, CVSS score gauges, and AI remediation diffs.</p>
            </div>

            <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-5 space-y-2">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                <FileSpreadsheet className="h-5 w-5" /> Word (DOCX) Audit Report
              </div>
              <p className="text-xs text-slate-300">Editable Word document containing styled compliance tables, architectural breakdown, and branding headers.</p>
            </div>

            <div className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-5 space-y-2">
              <div className="flex items-center gap-2 text-orange-400 font-bold text-sm">
                <Presentation className="h-5 w-5" /> PowerPoint (PPTX) Deck
              </div>
              <p className="text-xs text-slate-300">Presentation deck for executive briefings featuring OWASP charts, system diagrams, and strategic roadmaps.</p>
            </div>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : repositories.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border bg-card/40">
              <FolderGit2 className="h-12 w-12 text-slate-600 mb-3" />
              <h3 className="text-lg font-bold text-foreground">No Repositories Connected</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4 max-w-sm">Connect a repository first to generate executive PDF, Word, or PowerPoint reports.</p>
              <Link href="/repositories" className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 transition">
                Go to Repositories &rarr;
              </Link>
            </div>
          ) : (
            <ReportListTable reports={reports} />
          )}

          <ReportConfigModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onGenerate={handleGenerateReport}
            generating={generating}
          />
        </main>
      </div>
    </ProtectedRoute>
  );
}
