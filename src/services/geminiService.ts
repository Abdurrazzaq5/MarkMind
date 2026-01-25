import { GoogleGenAI } from "@google/genai";
import type {
  GeminiConfig,
  GeminiError,
  CompletionRequest,
  CompletionResponse,
} from "./types";

class GeminiService {
  private client: GoogleGenAI | null = null;
  private model: string = "gemini-3-flash-preview";

  // initialize the Gemini client with API Key
  initialize(config: GeminiConfig): void {
    if (!config.apiKey) {
      throw new Error("Gemini API Key is required");
    }

    this.client = new GoogleGenAI({ apiKey: config.apiKey });

    if (config.model) {
      this.model = config.model;
    }
  }
  // check if service is initialized
  isInitialized(): boolean {
    return this.client !== null;
  }

  // generate completion for the given prompt
  async complete(request: CompletionRequest): Promise<CompletionResponse> {
    if (!this.client) {
      throw new Error(
        "Gemini service not initialized. Call initialize() first.",
      );
    }

    try {
      //build the full prompt with context if provided
      const fullPrompt = request.context
        ? `${request.context}\n\n${request.prompt}`
        : request.prompt;

      // the actual gemini call
      const response = await this.client.models.generateContent({
        model: this.model,
        contents: fullPrompt,
      });

      // extract text from response
      const text = response.text || "";

      // Map SDK usage metadata to our CompletionResponse.usage shape.
      const rawUsage = (response as any).usageMetadata;
      let usage: CompletionResponse["usage"] | undefined = undefined;

      if (rawUsage) {
        const getFirst = (keys: string[]) => {
          for (const k of keys) {
            const v = rawUsage[k];
            if (v !== undefined && v !== null) return v;
          }
          return undefined;
        };

        const promptVal = getFirst([
          "promptTokens",
          "promptTokenCount",
          "prompt_token_count",
          "prompt_tokens",
          "prompt_token",
          "prompt",
        ]);
        const completionVal = getFirst([
          "completionTokens",
          "completionTokenCount",
          "completion_token_count",
          "completion_tokens",
          "completion_token",
          "completion",
        ]);
        const totalVal = getFirst([
          "totalTokens",
          "totalTokenCount",
          "total_token_count",
          "total_tokens",
          "total_token",
          "total",
        ]);

        const promptN = Number(promptVal);
        const completionN = Number(completionVal);
        const totalN = Number(totalVal);

        // Only set usage if all three are finite numbers to match the expected shape
        if (
          Number.isFinite(promptN) &&
          Number.isFinite(completionN) &&
          Number.isFinite(totalN)
        ) {
          usage = {
            promptTokens: promptN,
            completionTokens: completionN,
            totalTokens: totalN,
          };
        } else {
          usage = undefined;
        }
      }

      return {
        text,
        usage,
      };
    } catch (error: unknown) {
      // Ensure we only pass a string or an Error instance when throwing
      throw this.handleError(error);
    }
  }

  // Stream completion (for future implementation)
  async *streamComplete(request: CompletionRequest): AsyncGenerator<string> {
    if (!this.client) {
      throw new Error("Gemini service not initialized");
    }

    try {
      const fullPrompt = request.context
        ? `${request.context}\n\n${request.prompt}`
        : request.prompt;

      const stream = await this.client.models.generateContentStream({
        model: this.model,
        contents: fullPrompt,
      });

      for await (const chunk of stream) {
        if (chunk.text) {
          yield chunk.text;
        }
      }
    } catch (error) {
      throw this.handleError(String(error));
    }
  }

  // Handle and format errors
  private handleError(error: unknown): GeminiError {
    if (error instanceof Error) {
      return {
        message: error.message,
        code: "GEMINI_ERROR",
        details: error,
      };
    }

    return {
      message: "An unknown error occured",
      code: "UNKNOWN_ERROR",
      details: error,
    };
  }
  //Reset the service (useful for changing API keys)
  reset(): void {
    this.client = null;
  }
}

export const geminiService = new GeminiService();
