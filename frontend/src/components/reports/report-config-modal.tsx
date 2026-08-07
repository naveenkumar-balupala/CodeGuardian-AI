import React, { useState } from 'react';
import { FileText, FileSpreadsheet, Presentation, Sparkles, X, Palette, Building2, User } from 'lucide-react';
import { ReportExportRequest } from '@/types/reports';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (req: ReportExportRequest) => void;
  generating: boolean;
}

export const ReportConfigModal: React.FC<Props> = ({ isOpen, onClose, onGenerate, generating }) => {
  const [format, setFormat] = useState<'PDF' | 'DOCX' | 'PPTX'>('PDF');
  const [title, setTitle] = useState('Enterprise Security & Repository Audit Report');
  const [companyName, setCompanyName] = useState('CodeGuardian AI Corp');
  const [logoUrl, setLogoUrl] = useState('https://codeguardian.ai/logo.png');
  const [brandColor, setBrandColor] = useState('#4f46e5');
  const [author, setAuthor] = useState('Automated Security & Audit Engine');

  const [includeSummary, setIncludeSummary] = useState(true);
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeAI, setIncludeAI] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      format,
      title,
      include_executive_summary: includeSummary,
      include_charts: includeCharts,
      include_ai_explanations: includeAI,
      branding: {
        company_name: companyName,
        logo_url: logoUrl,
        brand_color: brandColor,
        author,
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold tracking-tight text-foreground">Configure Professional Report Export</h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:text-foreground hover:bg-accent">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Format Selector Pills */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300">Export Format</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setFormat('PDF')}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 font-bold transition ${
                  format === 'PDF' ? 'border-red-500/50 bg-red-500/10 text-red-400' : 'border-border bg-background text-slate-400'
                }`}
              >
                <FileText className="h-4 w-4" /> PDF Document
              </button>
              <button
                type="button"
                onClick={() => setFormat('DOCX')}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 font-bold transition ${
                  format === 'DOCX' ? 'border-blue-500/50 bg-blue-500/10 text-blue-400' : 'border-border bg-background text-slate-400'
                }`}
              >
                <FileSpreadsheet className="h-4 w-4" /> Word (DOCX)
              </button>
              <button
                type="button"
                onClick={() => setFormat('PPTX')}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 font-bold transition ${
                  format === 'PPTX' ? 'border-orange-500/50 bg-orange-500/10 text-orange-400' : 'border-border bg-background text-slate-400'
                }`}
              >
                <Presentation className="h-4 w-4" /> PowerPoint (PPTX)
              </button>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Report Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none font-semibold"
            />
          </div>

          {/* Custom Branding Inputs */}
          <div className="rounded-xl border border-border bg-background/50 p-4 space-y-3">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Palette className="h-4 w-4 text-primary" /> Enterprise Branding Customization
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                  <Building2 className="h-3 w-3" /> Company Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full rounded-lg border border-border bg-card px-2.5 py-1.5 text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                  <User className="h-3 w-3" /> Author / Department
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full rounded-lg border border-border bg-card px-2.5 py-1.5 text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border bg-background px-4 py-2 text-slate-300 font-semibold hover:bg-accent transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={generating}
              className="rounded-xl bg-primary px-5 py-2 font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition shadow-lg shadow-primary/20"
            >
              {generating ? 'Generating Export...' : `Generate ${format} Report`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
