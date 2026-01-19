import { useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

import { once } from "@tauri-apps/api/event";
import { handleSaveFile } from "@/lib/fileOperations";
import { useEditorStore } from "@/store/editorStore"; // <-- adjust path if your store lives elsewhere

export default function MarkdownEditor() {
  // Select only what you need from the store — component re-renders only when these values change
  const content = useEditorStore((state) => state.content);
  const setContent = useEditorStore((state) => state.setContent);

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleEditorScroll = () => {
    if (!editorRef.current || !previewRef.current) return;

    const editor = editorRef.current;
    const preview = previewRef.current;

    const denom = editor.scrollHeight - editor.clientHeight || 1;
    const scrollPercentage = editor.scrollTop / denom;

    preview.scrollTop =
      scrollPercentage * (preview.scrollHeight - preview.clientHeight || 0);
  };

  const handlePreviewScroll = () => {
    if (!editorRef.current || !previewRef.current) return;

    const editor = editorRef.current;
    const preview = previewRef.current;

    const denom = preview.scrollHeight - preview.clientHeight || 1;
    const scrollPercentage = preview.scrollTop / denom;

    editor.scrollTop =
      scrollPercentage * (editor.scrollHeight - editor.clientHeight || 0);
  };

  useEffect(() => {
    // Register the listener using 'once' to handle a single save event.
    // When the shortcut triggers, call the centralized handleSaveFile()
    // which uses the store's state (so we don't need separate refs for saving).
    let unlistenFn: (() => void) | null = null;

    (async () => {
      const unlisten = await once("save-triggered", async () => {
        try {
          await handleSaveFile();
          console.log("File saved via handleSaveFile");
        } catch (error) {
          console.error("Save failed:", error);
          // TODO: surface a UI notification to the user
        }
      });

      unlistenFn = unlisten;
    })();

    return () => {
      if (unlistenFn) {
        try {
          unlistenFn();
        } catch (e) {
          // ignore cleanup errors
        }
      }
    };
    // Run once on mount; handleSaveFile reads from the store directly.
  }, []);

  return (
    <div className="flex h-screen">
      {/* Editor Pane */}
      <div className="w-1/2 border-r">
        <textarea
          value={content}
          ref={editorRef}
          onChange={(e) => setContent(e.target.value)}
          onScroll={handleEditorScroll}
          className="w-full h-full p-4 font-mono resize-none focus:outline-none"
          placeholder="Write markdown here..."
        />
      </div>

      {/* Preview Pane */}
      <div
        ref={previewRef}
        onScroll={handlePreviewScroll}
        className="w-1/2 overflow-auto p-4 prose prose-slate dark:prose-invert max-w-none"
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
