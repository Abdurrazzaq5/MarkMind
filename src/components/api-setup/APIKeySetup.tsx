import { useState, useEffect } from "react";
import { ApiKeyManager } from "@/lib/apiKeyManager";
import { initializeAI } from "@/lib/aiOperations";

export function APIKeySetup() {
  const [apiKey, setApiKey] = useState("");
  const [hasKey, setHasKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    checkExistingKey();
  }, []);

  const checkExistingKey = async () => {
    const exists = await ApiKeyManager.exists();
    setHasKey(exists);

    if (exists) {
      await initializeAI();
    }
  };

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setError("Please enter an API Key");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await ApiKeyManager.save(apiKey);
      await initializeAI();
      setHasKey(true);
      setShowInput(false);
      setApiKey("");
    } catch (err) {
      setError("Failed to save api key");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm("Remove API key from secure storage?")) return;
    setIsLoading(true);
    try {
      await ApiKeyManager.delete();
      setHasKey(false);
    } catch (err) {
      setError("Failed to remove API key");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (hasKey && !showInput) {
    return (
      <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded">
        <span className="text-sm text-green-700">✓ AI features enabled</span>
        <button
          onClick={() => setShowInput(true)}
          className="text-xs text-green-600 hover:text-green-800"
        >
          Change Key
        </button>
        <button
          onClick={handleRemove}
          className="text-xs text-red-600 hover:text-red-800"
          disabled={isLoading}
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
      <h3 className="text-sm font-semibold mb-2">Set up AI Features</h3>
      <p className="text-xs text-gray-600 mb-3">
        Get a free API key from{" "}
        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Google AI Studio
        </a>
      </p>

      <div className="flex gap-2">
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter Gemini API key"
          className="flex-1 px-3 py-2 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          onClick={handleSave}
          disabled={isLoading || !apiKey.trim()}
          className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isLoading ? "Saving..." : "Save"}
        </button>
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
