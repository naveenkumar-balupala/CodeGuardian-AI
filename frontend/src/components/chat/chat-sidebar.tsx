import React from 'react';
import { Plus, MessageSquare, Layers, FileCode, FileText, Wrench, Code2, Bug } from 'lucide-react';
import { ChatSessionResponse } from '@/types/chat';

interface Props {
  sessions: ChatSessionResponse[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onQuickPrompt: (promptText: string) => void;
}

export const ChatSidebar: React.FC<Props> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onQuickPrompt,
}) => {
  const quickPrompts = [
    { label: 'Explain Architecture', icon: Layers, prompt: 'Explain the high-level software architecture and module layout.' },
    { label: 'Explain File', icon: FileCode, prompt: 'Explain backend/app/core/database.py and its connection fallback mechanism.' },
    { label: 'Generate Docs', icon: FileText, prompt: 'Generate Markdown API documentation for the endpoints.' },
    { label: 'Suggest Fixes', icon: Wrench, prompt: 'Suggest code refactoring improvements with patch diffs.' },
    { label: 'Explain APIs', icon: Code2, prompt: 'Explain all REST API endpoints and authentication payloads.' },
    { label: 'Find Bugs', icon: Bug, prompt: 'Find potential bugs, unhandled exceptions, and edge-cases.' },
  ];

  return (
    <div className="w-full rounded-2xl border border-border bg-card/60 p-4 shadow-sm backdrop-blur flex flex-col gap-5">
      {/* New Session Action */}
      <button
        onClick={onNewSession}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition shadow-md shadow-primary/20 w-full"
      >
        <Plus className="h-4 w-4" /> New Analysis Session
      </button>

      {/* Quick RAG Intent Prompts */}
      <div className="space-y-2 border-b border-border pb-4">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Quick Intent Shortcuts</span>
        <div className="flex flex-col gap-1.5">
          {quickPrompts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onQuickPrompt(item.prompt)}
              className="flex items-center gap-2 rounded-xl border border-border/50 bg-background/60 px-3 py-2 text-[11px] font-semibold text-slate-300 hover:text-primary hover:border-primary/40 hover:bg-primary/5 transition text-left w-full"
            >
              <item.icon className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat History Timeline */}
      <div className="flex-1 space-y-2 overflow-y-auto max-h-[300px]">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Chat Sessions ({sessions.length})
          </span>
        </div>
        {sessions.length === 0 ? (
          <p className="text-xs text-slate-500 py-3 text-center">No active chat sessions.</p>
        ) : (
          <div className="space-y-1">
            {sessions.map((sess) => (
              <button
                key={sess.id}
                onClick={() => onSelectSession(sess.id)}
                className={`w-full flex items-center gap-2.5 rounded-xl p-2.5 text-xs font-semibold transition text-left ${
                  activeSessionId === sess.id
                    ? 'bg-primary/10 text-primary border border-primary/30 font-bold'
                    : 'text-slate-300 hover:bg-accent/50'
                }`}
              >
                <MessageSquare className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span className="truncate">{sess.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
