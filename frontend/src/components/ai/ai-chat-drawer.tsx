'use client';

import React, { useState } from 'react';
import { Send, Bot, User as UserIcon, X, Loader2, Sparkles, FileCode } from 'lucide-react';
import { AIAgentsService } from '@/services/ai-agents.service';
import { ChatMessage } from '@/types/ai-agents';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AIChatDrawer: React.FC<Props> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I am Code Guardian, your AI Security & Architecture assistant. Ask me anything about SAST findings, SQLAlchemy models, performance optimizations, or patch remediations.',
      referenced_files: ['backend/app/main.py', 'backend/app/core/security.py'],
      suggested_followups: ['Show critical security findings', 'Explain architectural patterns'],
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const response = await AIAgentsService.chat(query, messages);
      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: response.data.answer,
        referenced_files: response.data.referenced_files,
        suggested_followups: response.data.suggested_followups,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Error: ${err.message || 'Failed to get answer from Code Guardian.'}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-card border-l border-border shadow-2xl flex flex-col">
      {/* Drawer Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-background/50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/30">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Code Guardian AI Chat</h3>
            <p className="text-[10px] text-slate-400">Conversational Assistant with Codebase Memory</p>
          </div>
        </div>

        <button onClick={onClose} className="p-1 text-slate-400 hover:text-foreground hover:bg-accent rounded-lg">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="h-7 w-7 rounded-lg bg-primary/10 border border-primary/30 text-primary flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 ${
                msg.role === 'user' ? 'bg-primary text-primary-foreground font-medium' : 'bg-background border border-border text-foreground'
              }`}
            >
              <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>

              {/* Referenced Files */}
              {msg.referenced_files && msg.referenced_files.length > 0 && (
                <div className="pt-2 border-t border-border/40 space-y-1">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Referenced Files</span>
                  <div className="flex flex-wrap gap-1">
                    {msg.referenced_files.map((file, fIdx) => (
                      <span key={fIdx} className="inline-flex items-center gap-1 font-mono text-[10px] bg-card px-2 py-0.5 rounded border border-border text-slate-300">
                        <FileCode className="h-3 w-3 text-primary" /> {file}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Followups */}
              {msg.suggested_followups && msg.suggested_followups.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {msg.suggested_followups.map((fu, fuIdx) => (
                    <button
                      key={fuIdx}
                      onClick={() => handleSend(fu)}
                      className="text-[10px] font-semibold bg-accent hover:bg-primary/20 text-slate-300 hover:text-primary border border-border rounded-full px-2.5 py-1 transition"
                    >
                      ✨ {fu}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="h-7 w-7 rounded-lg bg-accent text-slate-300 flex items-center justify-center shrink-0">
                <UserIcon className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-slate-400 italic text-xs">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span>Code Guardian is analyzing codebase context...</span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-4 border-t border-border bg-background/50 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Code Guardian about security, ORM models, or fixes..."
          className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-slate-500 focus:border-primary focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-3.5 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 transition"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
};
