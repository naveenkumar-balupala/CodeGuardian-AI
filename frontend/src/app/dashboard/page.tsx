'use client';

import React from 'react';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { ProjectScoreCard } from '@/components/dashboard/project-score-card';
import { ProjectHealthCard } from '@/components/dashboard/project-health-card';
import { RepositoryStatusTable } from '@/components/dashboard/repository-status-table';
import { ReviewHistoryTable } from '@/components/dashboard/review-history-table';
import { VulnerabilityCharts } from '@/components/dashboard/vulnerability-charts';
import { RecentActivityFeed } from '@/components/dashboard/recent-activity-feed';
import { NotificationsPanel } from '@/components/dashboard/notifications-panel';
import { useDashboard } from '@/hooks/use-dashboard';
import { RefreshCw, Loader2, ShieldAlert } from 'lucide-react';

export default function DashboardPage() {
  const { data, loading, error, refresh } = useDashboard();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <DashboardHeader />

        <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 md:px-8 space-y-8">
          {/* Header Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Security Overview Dashboard</h1>
              <p className="text-slate-400 text-xs md:text-sm mt-1">Real-time vulnerability metrics, repository status, and AI remediation intelligence.</p>
            </div>
            <button
              onClick={refresh}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-accent disabled:opacity-50 transition"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Metrics</span>
            </button>
          </div>

          {loading && !data ? (
            <div className="flex h-96 items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-red-500/50 bg-red-500/10 text-center">
              <ShieldAlert className="h-10 w-10 text-red-400 mb-2" />
              <h3 className="text-lg font-bold text-red-300">Dashboard Failed to Load</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">{error}</p>
              <button onClick={refresh} className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg">
                Retry
              </button>
            </div>
          ) : data ? (
            <>
              {/* Row 1: KPI Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ProjectScoreCard metric={data.project_score} />
                <ProjectHealthCard breakdown={data.severity_breakdown} />

                {/* Stat 3: Monitored Repos */}
                <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur flex flex-col justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Monitored Repositories</span>
                  <div className="my-2">
                    <span className="text-4xl font-extrabold text-foreground">{data.total_repositories}</span>
                    <span className="block text-xs text-emerald-400 font-medium mt-1">Active Protection Enabled</span>
                  </div>
                  <div className="text-xs text-slate-400 border-t border-border/50 pt-3 font-mono">100% CI/CD Integrated</div>
                </div>

                {/* Stat 4: Scan Pass Rate */}
                <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur flex flex-col justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Scan Suite Pass Rate</span>
                  <div className="my-2">
                    <span className="text-4xl font-extrabold text-foreground">{data.pass_rate_percentage}%</span>
                    <span className="block text-xs text-slate-400 font-medium mt-1">{data.total_scans_run} Total Scans Executed</span>
                  </div>
                  <div className="text-xs text-slate-400 border-t border-border/50 pt-3 font-mono">SAST & Secret Audits Passed</div>
                </div>
              </div>

              {/* Row 2: Charts Section */}
              <VulnerabilityCharts trends={data.security_trends} breakdown={data.severity_breakdown} />

              {/* Row 3: Repository Status Table & Activity Feed */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <RepositoryStatusTable repositories={data.repositories} />
                </div>
                <div>
                  <RecentActivityFeed activities={data.recent_activity} />
                </div>
              </div>

              {/* Row 4: Security Review History & Alerts Drawer */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ReviewHistoryTable reviews={data.review_history} />
                <NotificationsPanel notifications={data.notifications} />
              </div>
            </>
          ) : null}
        </main>
      </div>
    </ProtectedRoute>
  );
}
