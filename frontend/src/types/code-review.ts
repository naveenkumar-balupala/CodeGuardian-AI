export interface ReviewIssueItem {
  id: string;
  tool: 'Semgrep' | 'SonarQube' | 'Bandit' | 'ESLint' | 'Pylint';
  type: 'VULNERABILITY' | 'CODE_SMELL' | 'DEAD_CODE' | 'NAMING' | 'COMPLEXITY';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  file_path: string;
  line_number: number;
  code_snippet: string;
  ai_explanation: string;
  ai_suggestion: string;
  patch_diff?: string;
}

export interface CodeReviewResponse {
  id: string;
  repository_id: string;
  overall_score: number;
  grade: string;
  cyclomatic_complexity: number;
  maintainability_index: number;
  dead_code_count: number;
  naming_violations_count: number;
  code_smells_count: number;
  issues: ReviewIssueItem[];
  reviewed_at: string;
}
