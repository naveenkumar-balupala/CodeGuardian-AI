export interface ModuleCouplingItem {
  module_name: string;
  fan_in: number;
  fan_out: number;
  instability: number;
  coupling_status: 'LOW' | 'BALANCED' | 'HIGH_COUPLING';
}

export interface PrincipleViolation {
  principle: 'SRP' | 'OCP' | 'LSP' | 'ISP' | 'DIP' | 'DRY' | 'KISS';
  title: string;
  file_path: string;
  line_number: number;
  description: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface ArchitectureRecommendation {
  priority: number;
  title: string;
  description: string;
  patch_diff?: string;
}

export interface ArchitectureReportResponse {
  id: string;
  repository_id: string;
  pattern: string;
  coupling_score: number;
  solid_score: number;
  dry_score: number;
  kiss_score: number;
  detected_patterns: string[];
  solid_violations: PrincipleViolation[];
  dry_violations: PrincipleViolation[];
  kiss_violations: PrincipleViolation[];
  module_coupling: ModuleCouplingItem[];
  mermaid_diagram: string;
  ai_recommendations: ArchitectureRecommendation[];
  scanned_at: string;
}
