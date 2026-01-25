import { useState } from "react";
import { useEditorStore } from "@/store/editorStore";
import {
  continueWriting,
  improveText,
  summarizeText,
} from "@/lib/aiOperations";

export function AIActions() {
  const content = useEditorStore((state) => state.content);
  const setContent = useEditorStore((state) => state.setContent);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const handleContinueWriting = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const continuation = await continueWriting();
      setAiResponse(continuation);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate continuation",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleImprove = async () => {
    if (!content.trim()) {
      setError("No content to improve");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const improved = await improveText(content);
      setAiResponse(improved);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to improve text");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (!content.trim()) {
      setError("No content to summarize");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const summary = await summarizeText();
      setAiResponse(summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to summarize");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptResponse = () => {
    if (aiResponse) {
      setContent(content + "\n\n" + aiResponse);
      setAiResponse(null);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-2 bg-gray-50 border-b">
      <div className="flex gap-2">
        <button
          onClick={handleContinueWriting}
          disabled={isLoading}
          className="px-3 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isLoading ? "Generating..." : "Continue Writing"}
        </button>

        <button
          onClick={handleImprove}
          disabled={isLoading || !content}
          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Improve Text
        </button>

        <button
          onClick={handleSummarize}
          disabled={isLoading || !content}
          className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Summarize
        </button>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex items-center gap-2 p-2 bg-blue-50 rounded">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-blue-700">Thinking...</span>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-2 bg-red-50 border border-red-200 rounded">
          <p className="text-sm text-red-700">Error: {error}</p>
        </div>
      )}

      {/* AI Response Preview */}
      {aiResponse && !isLoading && (
        <div className="p-3 bg-white border rounded">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold text-gray-600">
              AI Suggestion:
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleAcceptResponse}
                className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Accept
              </button>
              <button
                onClick={() => setAiResponse(null)}
                className="text-xs px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
              >
                Dismiss
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-800 whitespace-pre-wrap">
            {aiResponse}
          </p>
        </div>
      )}
    </div>
  );
}
