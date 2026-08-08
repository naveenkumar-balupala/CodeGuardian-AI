export interface ProjectScoreMetric {
  score: number;
  grade: string;
  previous_score: number;
  status_label: string;
}

export interface SeverityBreakdown {
  critical: number;
  high: number;
  medium: number;
  low: number;
  info: number;
  total: number;
}

export interface RepositorySummary {
  id: string;
  name: string;
  full_name: string;
  provider: string;
  branch: string;
  status: string;
  vulnerability_count: number;
  last_scan_at?: string;
}

export interface ReviewHistoryItem {
  id: string;
  finding_title: string;
  rule_id: string;
  file_path: string;
  auditor_name: string;
  previous_status: string;
  new_status: string;
  comment?: string;
  timestamp: string;
}

export interface SecurityTrendPoint {
  date: string;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface ActivityItem {
  id: string;
  action: string;
  user_name: string;
  resource_type: string;
  details: string;
  timestamp: string;
}

export interface NotificationAlert {
  id: string;
  title: string;
  message: string;
  severity: string;
  timestamp: string;
  read: boolean;
  type?: string;
  created_at?: string;
}

export interface DashboardSummary {
  project_score: ProjectScoreMetric;
  severity_breakdown: SeverityBreakdown;
  total_repositories: number;
  total_scans_run: number;
  pass_rate_percentage: number;
  repositories: RepositorySummary[];
  review_history: ReviewHistoryItem[];
  security_trends: SecurityTrendPoint[];
  recent_activity: ActivityItem[];
  notifications: NotificationAlert[];
}
