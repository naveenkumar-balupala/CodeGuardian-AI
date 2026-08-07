export interface SourceReference {
  file_path: string;
  line_start?: number;
  line_end?: number;
  snippet?: string;
}

export interface ChatMessageResponse {
  id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  referenced_files: SourceReference[];
  created_at: string;
}

export interface ChatSessionResponse {
  id: string;
  repository_id: string;
  user_id: string;
  title: string;
  created_at: string;
  messages: ChatMessageResponse[];
}
