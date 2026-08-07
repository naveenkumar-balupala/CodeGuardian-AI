import React from 'react';
import { Download, FileText, FileSpreadsheet, Presentation, Calendar, Building } from 'lucide-react';
import { ReportExportResponse } from '@/types/reports';
import { ReportsService } from '@/services/reports.service';

interface Props {
  reports: ReportExportResponse[];
}

export const ReportListTable: React.FC<Props> = ({ reports }) => {
  const getFormatBadge = (fmt: string) => {
    switch (fmt) {
      case 'PDF':
        return <span className="bg-red-500/10 text-red-400 border border-red-500/30 px-2.5 py-1 rounded-md text-[10px] font-extrabold font-mono inline-flex items-center gap-1"><FileText className="h-3 w-3" /> PDF</span>;
      case 'DOCX':
        return <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2.5 py-1 rounded-md text-[10px] font-extrabold font-mono inline-flex items-center gap-1"><FileSpreadsheet className="h-3 w-3" /> DOCX</span>;
      default:
        return <span className="bg-orange-500/10 text-orange-400 border border-orange-500/30 px-2.5 py-1 rounded-md text-[10px] font-extrabold font-mono inline-flex items-center gap-1"><Presentation className="h-3 w-3" /> PPTX</span>;
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h3 className="text-base font-bold tracking-tight text-foreground">Generated Enterprise Reports History</h3>
        <span className="text-xs text-slate-400 font-mono font-semibold">{reports.length} Total Export(s)</span>
      </div>

      {reports.length === 0 ? (
        <div className="p-8 text-center rounded-xl border border-dashed border-border bg-background/50">
          <p className="text-xs text-slate-400">No report exports generated yet for this repository.</p>
        </div>
      ) : (
        <div className="divide-y divide-border/40">
          {reports.map((report) => (
            <div key={report.id} className="py-4 flex flex-wrap items-center justify-between gap-4 hover:bg-accent/20 px-2 rounded-xl transition">
              <div className="flex items-center gap-3">
                {getFormatBadge(report.format)}
                <div>
                  <h4 className="text-xs font-bold text-foreground">{report.title}</h4>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono mt-0.5">
                    <span className="flex items-center gap-1"><Building className="h-3 w-3" /> {report.branding_info.company_name}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(report.generated_at).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-slate-500 font-semibold">{Math.round(report.file_size_bytes / 1024)} KB</span>
                <a
                  href={ReportsService.getDownloadUrl(report.file_name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-primary-foreground transition shadow-sm"
                >
                  <Download className="h-3.5 w-3.5" /> Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
