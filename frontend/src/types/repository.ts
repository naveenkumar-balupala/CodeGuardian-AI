export type RepoProvider = 'GITHUB' | 'GITLAB' | 'BITBUCKET' | 'LOCAL';

export interface Repository {
  id: string;
  organization_id: string;
  name: string;
  full_name: string;
  provider: RepoProvider;
  clone_url: string;
  default_branch: string;
  is_private: boolean;
  size_bytes: number;
  file_count: number;
  last_commit_hash?: string;
  last_commit_author?: string;
  last_commit_message?: string;
  processing_status: 'QUEUED' | 'CLONING' | 'VIRUS_CHECK' | 'INDEXING' | 'COMPLETED' | 'FAILED';
  processing_progress: number;
  created_at: string;
}

export interface RepositoryProgress {
  id: string;
  processing_status: string;
  processing_progress: number;
  processing_error?: string;
}
