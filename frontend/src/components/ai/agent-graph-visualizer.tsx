import React from 'react';
import { Cpu, ShieldCheck, Database, Layers, CheckCircle2, Zap, FileCode, TestTube, FileText, Sparkles, ArrowRight } from 'lucide-react';

interface Props {
  completedNodes: string[];
  isRunning: boolean;
}

export const AgentGraphVisualizer: React.FC<Props> = ({ completedNodes, isRunning }) => {
  const agents = [
    { id: 'Coordinator', name: 'Coordinator Agent', role: 'Graph Orchestrator', icon: Cpu, color: 'text-blue-400 border-blue-500/30' },
    { id: 'RepositoryAgent', name: 'Repository Agent', role: 'File & Manifest Inspector', icon: FileCode, color: 'text-indigo-400 border-indigo-500/30' },
    { id: 'ArchitectureAgent', name: 'Architecture Agent', role: 'Pattern & Layer Specialist', icon: Layers, color: 'text-purple-400 border-purple-500/30' },
    { id: 'SecurityAgent', name: 'Security Agent', role: 'SAST & Vulnerability Auditor', icon: ShieldCheck, color: 'text-red-400 border-red-500/30' },
    { id: 'DatabaseAgent', name: 'Database Agent', role: 'ORM & Query Specialist', icon: Database, color: 'text-emerald-400 border-emerald-500/30' },
    { id: 'PerformanceAgent', name: 'Performance Agent', role: 'Latency & Event Loop Auditor', icon: Zap, color: 'text-yellow-400 border-yellow-500/30' },
    { id: 'TestingAgent', name: 'Testing Agent', role: 'Test Suite & Coverage Auditor', icon: TestTube, color: 'text-cyan-400 border-cyan-500/30' },
    { id: 'DocumentationAgent', name: 'Documentation Agent', role: 'OpenAPI & Docstring Auditor', icon: FileText, color: 'text-pink-400 border-pink-500/30' },
    { id: 'RecommendationAgent', name: 'Recommendation Agent', role: 'Fix & Patch Diff Synthesizer', icon: Sparkles, color: 'text-amber-400 border-amber-500/30' },
    { id: 'ReportAgent', name: 'Report Agent', role: 'Audit Report Compiler', icon: CheckCircle2, color: 'text-emerald-400 border-emerald-500/30' },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm backdrop-blur space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h3 className="text-base font-bold tracking-tight text-foreground">LangGraph Multi-Agent Orchestration Engine</h3>
          <p className="text-xs text-slate-400 mt-0.5">Real-time state graph dispatch across 11 domain-specialized AI agents</p>
        </div>

        <div className="flex items-center gap-2">
          {isRunning ? (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/30 animate-pulse">
              <Cpu className="h-3.5 w-3.5 animate-spin" /> Orchestrating Graph...
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
              <CheckCircle2 className="h-3.5 w-3.5" /> Graph State Synchronized
            </span>
          )}
        </div>
      </div>

      {/* Visual Nodes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {agents.map((agent) => {
          const Icon = agent.icon;
          const isDone = completedNodes.includes(agent.id);

          return (
            <div
              key={agent.id}
              className={`rounded-xl border bg-background/50 p-4 flex flex-col justify-between transition-all duration-300 ${
                isDone
                  ? 'border-emerald-500/50 bg-emerald-500/5 shadow-sm'
                  : isRunning
                  ? 'border-primary/50 animate-pulse'
                  : 'border-border/60 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-lg bg-card border ${agent.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-slate-600"></span>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold text-foreground">{agent.name}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{agent.role}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Status</span>
                <span className={isDone ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
                  {isDone ? 'COMPLETED' : isRunning ? 'RUNNING' : 'PENDING'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
