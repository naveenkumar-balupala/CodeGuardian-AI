'use client';

import React, { useState } from 'react';
import { Copy, Check, FileCode, ExternalLink } from 'lucide-react';

interface Props {
  content: string;
}

export const MarkdownRenderer: React.FC<Props> = ({ content }) => {
  const [copiedBlockIndex, setCopiedBlockIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedBlockIndex(index);
    setTimeout(() => setCopiedBlockIndex(null), 2000);
  };

  // Helper to parse line text into inline elements (bold, inline code, file links)
  const renderInlineText = (text: string) => {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
      // 1. File links: [label](file:///path#L1-L2) or [label](file://path)
      const fileLinkMatch = remaining.match(/\[([^\]]+)\]\((file:\/\/\/[^\)]+|file:\/\/[^\)]+)\)/);
      // 2. Bold text: **text**
      const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);
      // 3. Inline code: `code`
      const codeMatch = remaining.match(/`([^`]+)`/);

      // Find which pattern occurs earliest
      const matches = [
        fileLinkMatch ? { type: 'link', match: fileLinkMatch, index: fileLinkMatch.index! } : null,
        boldMatch ? { type: 'bold', match: boldMatch, index: boldMatch.index! } : null,
        codeMatch ? { type: 'code', match: codeMatch, index: codeMatch.index! } : null,
      ]
        .filter(Boolean)
        .sort((a, b) => a!.index - b!.index);

      if (matches.length === 0) {
        parts.push(remaining);
        break;
      }

      const earliest = matches[0]!;

      // Add text before match
      if (earliest.index > 0) {
        parts.push(remaining.substring(0, earliest.index));
      }

      if (earliest.type === 'link') {
        const [, label, url] = earliest.match;
        parts.push(
          <a
            key={key++}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-primary font-bold underline hover:text-primary/80 transition"
          >
            <FileCode className="h-3 w-3 inline text-slate-400" />
            <span>{label}</span>
          </a>
        );
        remaining = remaining.substring(earliest.index + earliest.match[0].length);
      } else if (earliest.type === 'bold') {
        const [, boldText] = earliest.match;
        parts.push(
          <strong key={key++} className="font-bold text-foreground">
            {boldText}
          </strong>
        );
        remaining = remaining.substring(earliest.index + earliest.match[0].length);
      } else if (earliest.type === 'code') {
        const [, codeText] = earliest.match;
        parts.push(
          <code key={key++} className="rounded bg-accent/80 border border-border/50 px-1.5 py-0.5 font-mono text-[11px] text-emerald-400 font-semibold">
            {codeText}
          </code>
        );
        remaining = remaining.substring(earliest.index + earliest.match[0].length);
      }
    }

    return parts;
  };

  // Split content into blocks (code blocks, tables, headings, paragraphs)
  const parseBlocks = (text: string) => {
    const blocks: React.ReactNode[] = [];
    const lines = text.split('\n');

    let inCodeBlock = false;
    let codeLanguage = '';
    let codeContent: string[] = [];
    let tableRows: string[] = [];
    let blockKey = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Code Block Start / End
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          // Close code block
          const fullCode = codeContent.join('\n');
          const currentBlockIdx = blockKey;

          blocks.push(
            <div key={blockKey++} className="my-3 rounded-xl border border-border/80 bg-slate-950/90 overflow-hidden shadow-lg font-mono text-[11px]">
              <div className="flex items-center justify-between px-4 py-2 border-b border-border/40 bg-slate-900/60 text-slate-400">
                <span className="text-[10px] uppercase font-bold tracking-wider text-primary">
                  {codeLanguage || 'code'}
                </span>
                <button
                  onClick={() => copyToClipboard(fullCode, currentBlockIdx)}
                  className="flex items-center gap-1 text-[10px] font-semibold hover:text-foreground transition"
                >
                  {copiedBlockIndex === currentBlockIdx ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-slate-200 leading-relaxed">
                <code>{fullCode}</code>
              </pre>
            </div>
          );
          inCodeBlock = false;
          codeContent = [];
          codeLanguage = '';
        } else {
          // Open code block
          inCodeBlock = true;
          codeLanguage = line.trim().substring(3).trim();
          codeContent = [];
        }
        continue;
      }

      if (inCodeBlock) {
        codeContent.push(line);
        continue;
      }

      // Markdown Tables
      if (line.trim().startsWith('|')) {
        tableRows.push(line);
        if (i === lines.length - 1 || !lines[i + 1].trim().startsWith('|')) {
          // Render table
          const headerRow = tableRows[0];
          const bodyRows = tableRows.slice(2); // Skip separator row

          const parseCells = (rowStr: string) =>
            rowStr
              .split('|')
              .slice(1, -1)
              .map((c) => c.trim());

          const headers = parseCells(headerRow);

          blocks.push(
            <div key={blockKey++} className="my-3 overflow-x-auto rounded-xl border border-border bg-background/50">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="border-b border-border bg-card/60 text-slate-300 font-semibold uppercase text-[10px]">
                  <tr>
                    {headers.map((h, idx) => (
                      <th key={idx} className="p-2.5">
                        {renderInlineText(h)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {bodyRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-accent/30 transition">
                      {parseCells(row).map((cell, cIdx) => (
                        <td key={cIdx} className="p-2.5 text-slate-300">
                          {renderInlineText(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );

          tableRows = [];
        }
        continue;
      }

      // Headings
      if (line.startsWith('### ')) {
        blocks.push(
          <h3 key={blockKey++} className="text-sm font-bold text-foreground mt-3 mb-1 tracking-tight">
            {renderInlineText(line.substring(4))}
          </h3>
        );
        continue;
      }
      if (line.startsWith('## ')) {
        blocks.push(
          <h2 key={blockKey++} className="text-base font-extrabold text-foreground mt-4 mb-1.5 tracking-tight">
            {renderInlineText(line.substring(3))}
          </h2>
        );
        continue;
      }
      if (line.startsWith('# ')) {
        blocks.push(
          <h1 key={blockKey++} className="text-lg font-black text-foreground mt-4 mb-2 tracking-tight">
            {renderInlineText(line.substring(2))}
          </h1>
        );
        continue;
      }

      // Bullet lists
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        blocks.push(
          <div key={blockKey++} className="flex items-start gap-2 text-xs text-slate-300 ml-2 my-0.5">
            <span className="text-primary font-bold mt-1 text-[10px]">•</span>
            <span>{renderInlineText(line.trim().substring(2))}</span>
          </div>
        );
        continue;
      }

      // Numbered lists
      const numMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        blocks.push(
          <div key={blockKey++} className="flex items-start gap-2 text-xs text-slate-300 ml-2 my-0.5">
            <span className="font-mono text-primary text-[11px] font-bold">{numMatch[1]}.</span>
            <span>{renderInlineText(numMatch[2])}</span>
          </div>
        );
        continue;
      }

      // Empty line
      if (!line.trim()) {
        blocks.push(<div key={blockKey++} className="h-1.5" />);
        continue;
      }

      // Regular paragraph
      blocks.push(
        <p key={blockKey++} className="text-xs leading-relaxed text-slate-300">
          {renderInlineText(line)}
        </p>
      );
    }

    return blocks;
  };

  return <div className="space-y-1.5 text-xs">{parseBlocks(content)}</div>;
};
