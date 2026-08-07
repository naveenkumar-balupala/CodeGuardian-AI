export interface BrandingConfig {
  company_name: string;
  logo_url?: string;
  brand_color: string;
  author: string;
}

export interface ReportExportRequest {
  format: 'PDF' | 'DOCX' | 'PPTX';
  title: string;
  include_executive_summary: boolean;
  include_charts: boolean;
  include_ai_explanations: boolean;
  branding: BrandingConfig;
}

export interface ReportExportResponse {
  id: string;
  repository_id: string;
  format: 'PDF' | 'DOCX' | 'PPTX';
  title: string;
  executive_summary: string;
  branding_info: BrandingConfig;
  file_name: string;
  file_size_bytes: number;
  download_url: string;
  generated_at: string;
}
