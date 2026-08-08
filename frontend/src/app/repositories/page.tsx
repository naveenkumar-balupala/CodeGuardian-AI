'use client';

import React, { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { AddRepoModal } from '@/components/repository/add-repo-modal';
import { RepoCard } from '@/components/repository/repo-card';
import { RepositoryService } from '@/services/repository.service';
import { Repository } from '@/types/repository';
import { Plus, Search, GitFork, Loader2, FolderGit2 } from 'lucide-react';

export default function RepositoriesPage() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [providerFilter, setProviderFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchRepositories = async () => {
    try {
      const response = await RepositoryService.listRepositories();
      setRepositories(response.data);
    } catch {
      // Ignore errors in polling
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepositories();
    // Auto-poll progress every 3 seconds for active cloning/indexing jobs
    const interval = setInterval(fetchRepositories, 3000);
    return () => clearInterval(interval);
  }, []);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this repository from CodeGuardian AI?')) {
      try {
        setErrorMessage(null);
        await RepositoryService.deleteRepository(id);
        fetchRepositories();
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to delete repository.');
      }
    }
  };

  const filteredRepos = repositories.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.full_name.toLowerCase().includes(search.toLowerCase());
    const matchesProvider = providerFilter === 'ALL' || r.provider === providerFilter;
    return matchesSearch && matchesProvider;
  });

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <DashboardHeader />

        <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 md:px-8 space-y-8">
          {errorMessage && (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs font-semibold text-red-400 flex items-center justify-between shadow-sm animate-in fade-in duration-300">
              <span>{errorMessage}</span>
              <button onClick={() => setErrorMessage(null)} className="text-red-400/70 hover:text-red-400 text-xs">
                &times;
              </button>
            </div>
          )}
          {/* Header Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Repository Management</h1>
              <p className="text-slate-400 text-xs md:text-sm mt-1">Connect Git URLs or upload ZIP source archives for SAST security analysis.</p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition shadow-lg shadow-primary/20"
            >
              <Plus className="h-4 w-4" /> Add Repository
            </button>
          </div>

          {/* Search & Provider Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-border bg-card/60 p-4 backdrop-blur">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by repository name or path..."
                className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-4 text-xs text-foreground placeholder:text-slate-500 focus:border-primary focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto text-xs">
              {['ALL', 'GITHUB', 'GITLAB', 'BITBUCKET', 'LOCAL'].map((provider) => (
                <button
                  key={provider}
                  onClick={() => setProviderFilter(provider)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                    providerFilter === provider
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background border border-border text-slate-400 hover:text-foreground'
                  }`}
                >
                  {provider === 'LOCAL' ? 'ZIP Uploads' : provider}
                </button>
              ))}
            </div>
          </div>

          {/* Repositories Grid */}
          {loading && repositories.length === 0 ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : filteredRepos.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border bg-card/40">
              <FolderGit2 className="h-12 w-12 text-slate-600 mb-3" />
              <h3 className="text-lg font-bold text-foreground">No Repositories Found</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4 max-w-sm">Connect a Git HTTPS/SSH URL or upload a ZIP archive to get started.</p>
              <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg">
                Add Repository
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRepos.map((repo) => (
                <RepoCard key={repo.id} repository={repo} onDelete={handleDelete} />
              ))}
            </div>
          )}

          {/* Add Repository Modal */}
          <AddRepoModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => fetchRepositories()}
          />
        </main>
      </div>
    </ProtectedRoute>
  );
}
