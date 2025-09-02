export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'ai';
  timestamp: Date;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error?: string;
}

export interface ChatAIResponse {
  content: string;
  success: boolean;
  error?: string;
}

export interface ChatHistory {
  messages: ChatMessage[];
  lastUpdated: Date;
}
