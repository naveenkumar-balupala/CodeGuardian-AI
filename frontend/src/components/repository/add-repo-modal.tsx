'use client';

import React, { useState } from 'react';
import { X, Github, UploadCloud, Link as LinkIcon, GitBranch, Key, AlertCircle, FileArchive } from 'lucide-react';
import { RepositoryService } from '@/services/repository.service';
import { Repository } from '@/types/repository';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (repo: Repository) => void;
}

export const AddRepoModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [tab, setTab] = useState<'url' | 'zip'>('url');
  
  // URL form state
  const [cloneUrl, setCloneUrl] = useState('');
  const [defaultBranch, setDefaultBranch] = useState('main');
  const [accessToken, setAccessToken] = useState('');
  
  // ZIP form state
  const [zipFile, setZipFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await RepositoryService.connectUrl({
        clone_url: cloneUrl,
        default_branch: defaultBranch,
        access_token: accessToken || undefined,
      });
      onSuccess(response.data);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to connect Git repository URL.');
    } finally {
      setLoading(false);
    }
  };

  const handleZipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!zipFile) {
      setError('Please select a .zip archive file.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await RepositoryService.uploadZip(zipFile);
      onSuccess(response.data);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to upload ZIP archive.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-foreground">Add Repository for Security Scanning</h3>
            <p className="text-xs text-slate-400 mt-0.5">Connect Git URL or upload a ZIP archive</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-accent hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-background p-1 border border-border">
          <button
            onClick={() => { setTab('url'); setError(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition ${
              tab === 'url' ? 'bg-card text-primary shadow-sm' : 'text-slate-400 hover:text-foreground'
            }`}
          >
            <LinkIcon className="h-4 w-4" /> Git URL (GitHub / GitLab / Bitbucket)
          </button>
          <button
            onClick={() => { setTab('zip'); setError(''); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition ${
              tab === 'zip' ? 'bg-card text-primary shadow-sm' : 'text-slate-400 hover:text-foreground'
            }`}
          >
            <UploadCloud className="h-4 w-4" /> ZIP Upload
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-500/50 bg-red-500/10 p-3 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tab 1: Git URL Form */}
        {tab === 'url' ? (
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Git Clone HTTPS/SSH URL</label>
              <div className="relative">
                <Github className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="url"
                  required
                  value={cloneUrl}
                  onChange={(e) => setCloneUrl(e.target.value)}
                  placeholder="https://github.com/org/repository.git"
                  className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Default Branch</label>
                <div className="relative">
                  <GitBranch className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={defaultBranch}
                    onChange={(e) => setDefaultBranch(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Personal Access Token (Optional)</label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                    placeholder="ghp_••••••••"
                    className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-foreground">
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? 'Connecting...' : 'Connect & Clone Repository'}
              </button>
            </div>
          </form>
        ) : (
          /* Tab 2: ZIP Upload Form */
          <form onSubmit={handleZipSubmit} className="space-y-4">
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-background p-8 text-center hover:border-primary transition cursor-pointer">
              <FileArchive className="h-10 w-10 text-primary mb-2 animate-bounce" />
              <label className="text-xs font-bold text-foreground cursor-pointer">
                <span>Click to browse</span> or drag and drop .zip file
                <input
                  type="file"
                  accept=".zip"
                  onChange={(e) => setZipFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
              <span className="text-[10px] text-slate-500 mt-1">Supported: ZIP source code archives up to 100MB</span>

              {zipFile && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-card px-3 py-1.5 text-xs text-emerald-400 border border-emerald-500/30">
                  <FileArchive className="h-4 w-4" />
                  <span className="font-semibold">{zipFile.name}</span>
                  <span className="text-[10px] text-slate-400">({Math.round(zipFile.size / 1024)} KB)</span>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-foreground">
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !zipFile}
                className="px-5 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? 'Uploading...' : 'Upload & Process Archive'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
