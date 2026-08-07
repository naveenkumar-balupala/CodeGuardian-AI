export interface SecurityFindingItem {
  id: string;
  category: 'SQL_INJECTION' | 'SECRETS' | 'XSS' | 'JWT' | 'CSRF' | 'DEPENDENCY' | 'OWASP';
  owasp_category: string;
  cwe_id: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  cvss_score: number;
  cvss_vector: string;
  file_path: string;
  line_number: number;
  code_snippet: string;
  recommendation: string;
  patch_diff?: string;
}

export interface SecurityAgentReportResponse {
  id: string;
  repository_id: string;
  risk_score: number;
  risk_level: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  critical_count: number;
  high_count: number;
  medium_count: number;
  low_count: number;
  findings: SecurityFindingItem[];
  owasp_distribution: Record<string, number>;
  chart_dataset: {
    severity_counts: Record<string, number>;
    category_breakdown: Array<{ name: string; count: number; color: string }>;
    cvss_trend: Array<{ label: string; score: number }>;
  };
  scanned_at: string;
}
