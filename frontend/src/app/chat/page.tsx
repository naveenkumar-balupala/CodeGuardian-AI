'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { DashboardHeader } from '@/components/layout/dashboard-header';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { ChatSidebar } from '@/components/chat/chat-sidebar';
import { ChatMessageBubble } from '@/components/chat/chat-message-bubble';
import { ChatService } from '@/services/chat.service';
import { RepositoryService } from '@/services/repository.service';
import { Repository } from '@/types/repository';
import { ChatSessionResponse, ChatMessageResponse } from '@/types/chat';
import { MessageSquare, Send, Loader2, FolderGit2 } from 'lucide-react';

export default function ChatPage() {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepoId, setSelectedRepoId] = useState<string>('');
  const [sessions, setSessions] = useState<ChatSessionResponse[]>([]);
  const [activeSession, setActiveSession] = useState<ChatSessionResponse | null>(null);

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    RepositoryService.listRepositories()
      .then((res) => {
        const repoList = res?.data || [];
        setRepositories(repoList);
        if (repoList.length > 0) {
          setSelectedRepoId(repoList[0].id);
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const fetchSessions = useCallback(async (repoId: string) => {
    try {
      setLoading(true);
      const res = await ChatService.listSessions(repoId);
      const sessionList = res?.data || [];
      setSessions(sessionList);

      if (sessionList.length > 0) {
        const first = await ChatService.getSession(sessionList[0].id);
        setActiveSession(first?.data || null);
      } else {
        // Create initial session
        const created = await ChatService.createSession(repoId, 'Initial Repository Analysis');
        if (created?.data) {
          setSessions([created.data]);
          setActiveSession(created.data);
        }
      }
    } catch {
      setSessions([]);
      setActiveSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedRepoId) {
      fetchSessions(selectedRepoId);
    }
  }, [selectedRepoId, fetchSessions]);

  const handleSelectSession = async (sessionId: string) => {
    try {
      const res = await ChatService.getSession(sessionId);
      if (res?.data) {
        setActiveSession(res.data);
      }
    } catch {
      // Ignore
    }
  };

  const handleNewSession = async () => {
    if (!selectedRepoId) return;
    try {
      const res = await ChatService.createSession(selectedRepoId, `Analysis ${sessions.length + 1}`);
      if (res?.data) {
        setSessions((prev) => [res.data, ...prev]);
        setActiveSession(res.data);
      }
    } catch {
      // Ignore
    }
  };

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMessage;
    if (!textToSend.trim() || !activeSession || sending) return;

    setSending(true);
    if (!customPrompt) setInputMessage('');

    try {
      // Optimistic user message append
      const userMsg: ChatMessageResponse = {
        id: Math.random().toString(),
        session_id: activeSession.id,
        role: 'user',
        content: textToSend,
        referenced_files: [],
        created_at: new Date().toISOString(),
      };

      setActiveSession((prev) => (prev ? { ...prev, messages: [...prev.messages, userMsg] } : prev));

      const res = await ChatService.sendMessage(activeSession.id, textToSend);

      if (res?.data) {
        setActiveSession((prev) => (prev ? { ...prev, messages: [...prev.messages, res.data] } : prev));
      }
    } catch (err: any) {
      alert(err.message || 'Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <DashboardHeader />

        <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 md:px-8 space-y-6 flex flex-col">
          {/* Header Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-6 w-6 text-primary" />
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Repository Chat & RAG Assistant</h1>
              </div>
              <p className="text-slate-400 text-xs md:text-sm mt-1">
                Explore architecture, ask file explanations, find bugs, and generate docs with cited source file links
              </p>
            </div>

            <div className="flex items-center gap-3">
              {repositories.length > 0 && (
                <select
                  value={selectedRepoId}
                  onChange={(e) => setSelectedRepoId(e.target.value)}
                  className="rounded-xl border border-border bg-card px-3 py-2 text-xs text-foreground font-semibold focus:border-primary focus:outline-none"
                >
                  {repositories.map((repo) => (
                    <option key={repo.id} value={repo.id}>
                      {repo.full_name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex h-96 items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : repositories.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border bg-card/40">
              <FolderGit2 className="h-12 w-12 text-slate-600 mb-3" />
              <h3 className="text-lg font-bold text-foreground">No Repositories Connected</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4 max-w-sm">Connect a repository to chat with your codebase using AI and RAG.</p>
              <Link href="/repositories" className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 transition">
                Go to Repositories &rarr;
              </Link>
            </div>
          ) : (
            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
              {/* Sidebar Sessions & Quick Prompts */}
              <div className="md:col-span-1">
                <ChatSidebar
                  sessions={sessions}
                  activeSessionId={activeSession?.id || null}
                  onSelectSession={handleSelectSession}
                  onNewSession={handleNewSession}
                  onQuickPrompt={(prompt) => handleSendMessage(prompt)}
                />
              </div>

              {/* Chat Timeline & Message Input */}
              <div className="md:col-span-3 rounded-2xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur flex flex-col justify-between h-[600px]">
                {/* Messages Timeline */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                  {activeSession?.messages.map((msg) => (
                    <ChatMessageBubble key={msg.id} message={msg} />
                  ))}
                  {sending && (
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" /> RAG Engine searching repository context...
                    </div>
                  )}
                </div>

                {/* Input Box */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="mt-4 flex items-center gap-3 pt-3 border-t border-border"
                >
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask anything about this repository (e.g. Explain architecture, Find bugs, Explain APIs)..."
                    className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={sending || !inputMessage.trim()}
                    className="rounded-xl bg-primary px-5 py-3 text-xs font-bold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition shadow-md shadow-primary/20 flex items-center gap-1.5"
                  >
                    <Send className="h-4 w-4" /> Send
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
