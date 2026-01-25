import { geminiService } from "@/services/geminiService";
import { ApiKeyManager } from "./apiKeyManager";
import { useEditorStore } from "@/store/editorStore";

export interface AICompletionOptions {
  includeContext?: boolean;
  contextLines?: number;
}

/**
 * Initialize Gemini service with stored API key
 */
export async function initializeAI(): Promise<boolean> {
  try {
    const apiKey = await ApiKeyManager.load();

    if (!apiKey) {
      return false;
    }

    geminiService.initialize({ apiKey });
    return true;
  } catch (error) {
    console.error("Failed to initialize AI:", error);
    return false;
  }
}

/**
 * Generate completion based on selected text or current context
 */
export async function generateCompletion(
  prompt: string,
  options: AICompletionOptions = {},
): Promise<string> {
  // Ensure service is initialized
  if (!geminiService.isInitialized()) {
    const initialized = await initializeAI();
    if (!initialized) {
      throw new Error(
        "Gemini API key not found. Please add your API key in settings.",
      );
    }
  }

  // Get context from editor if requested
  let context = "";
  if (options.includeContext) {
    const content = useEditorStore.getState().content;
    const lines = content.split("\n");
    const contextLineCount = options.contextLines || 10;

    // Get last N lines as context
    const contextLines = lines.slice(-contextLineCount);
    context = contextLines.join("\n");
  }

  // Call Gemini API
  const response = await geminiService.complete({
    prompt,
    context: options.includeContext ? context : undefined,
  });

  return response.text;
}

/**
 * Continue writing from cursor position
 */
export async function continueWriting(): Promise<string> {
  const content = useEditorStore.getState().content;

  const prompt = "Continue writing this document naturally:";

  return generateCompletion(prompt, {
    includeContext: true,
    contextLines: 20,
  });
}

/**
 * Improve selected text
 */
export async function improveText(text: string): Promise<string> {
  const prompt = `Improve the following text for clarity and grammar:\n\n${text}`;

  return generateCompletion(prompt, {
    includeContext: false,
  });
}

/**
 * Summarize document or selection
 */
export async function summarizeText(text?: string): Promise<string> {
  const textToSummarize = text || useEditorStore.getState().content;

  const prompt = `Provide a concise summary of the following text:\n\n${textToSummarize}`;

  return generateCompletion(prompt, {
    includeContext: false,
  });
}
