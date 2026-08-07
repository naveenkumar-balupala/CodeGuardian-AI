export interface AgentNodeStatus {
  id: string;
  name: string;
  role: string;
  status: 'IDLE' | 'RUNNING' | 'COMPLETED' | 'FAILED';
}

export interface OrchestrateResponse {
  repository_id: string;
  completed_nodes: string[];
  repository_data: any;
  architecture_data: any;
  security_data: any;
  database_data: any;
  performance_data: any;
  testing_data: any;
  documentation_data: any;
  recommendations_data: any;
  report_data: any;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  referenced_files?: string[];
  suggested_followups?: string[];
}

export interface ChatResponse {
  answer: string;
  referenced_files: string[];
  suggested_followups: string[];
}
