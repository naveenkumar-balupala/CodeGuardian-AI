import React from 'react';
import { User, Sparkles, FileCode } from 'lucide-react';
import { ChatMessageResponse } from '@/types/chat';
import { MarkdownRenderer } from './markdown-renderer';

interface Props {
  message: ChatMessageResponse;
}

export const ChatMessageBubble: React.FC<Props> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-indigo-600 text-white shadow-md shrink-0">
          <Sparkles className="h-4 w-4" />
        </div>
      )}

      <div
        className={`max-w-3xl rounded-2xl p-4 space-y-3 ${
          isUser
            ? 'bg-primary text-primary-foreground font-medium shadow-md shadow-primary/10'
            : 'bg-card border border-border text-foreground shadow-sm'
        }`}
      >
        {isUser ? (
          <div className="text-xs leading-relaxed whitespace-pre-wrap">{message.content}</div>
        ) : (
          <MarkdownRenderer content={message.content} />
        )}

        {/* Source File Citations */}
        {message.referenced_files && message.referenced_files.length > 0 && (
          <div className="pt-2 border-t border-border/40 space-y-1.5">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block">Cited Repository Sources</span>
            <div className="flex flex-wrap gap-2">
              {message.referenced_files.map((ref, idx) => (
                <a
                  key={idx}
                  href={`file:///${ref.file_path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-md bg-background border border-border/60 px-2 py-1 text-[11px] font-mono text-primary hover:underline"
                >
                  <FileCode className="h-3 w-3 text-slate-400" />
                  <span>{ref.file_path}{ref.line_start ? `#L${ref.line_start}` : ''}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-slate-800 text-slate-300 border border-border shrink-0">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
};
