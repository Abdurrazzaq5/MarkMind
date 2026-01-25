export interface GeminiConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
}

export interface CompletionRequest {
  prompt: string;
  context?: string;
  maxTokens?: number;
}

export interface CompletionResponse {
  text: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface GeminiError {
  message: string;
  code?: string;
  details?: unknown;
}
