export interface DependencyItem {
  name: string;
  version: string;
  category: 'frontend' | 'backend' | 'dev';
}

export interface RepositoryAnalysis {
  id: string;
  repository_id: string;
  languages: Record<string, number>;
  frameworks: string[];
  architecture_style: string;
  databases: string[];
  ci_cd_tools: string[];
  docker_configs: string[];
  package_managers: string[];
  has_swagger: boolean;
  dependencies: DependencyItem[];
  summary_report: string;
  scanned_at: string;
}
