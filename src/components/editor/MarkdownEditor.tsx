import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

import { once } from "@tauri-apps/api/event";
import { saveExistingFile, saveFileAs } from "@/lib/fileOperations";
// If you have a global store (e.g. useEditorStore), you could use it instead of local state:
// import useEditorStore from '@/stores/editor';

export default function MarkdownEditor() {
  const [content, setContent] = useState("# Start writing...");
  // Use local file path state or replace with your store's filePath/setFilePath
  const [filePath, setFilePath] = useState<string | null>(null);

  // refs to always have the latest values inside the event handler without re-subscribing
  const contentRef = useRef(content);
  const filePathRef = useRef(filePath);

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  useEffect(() => {
    filePathRef.current = filePath;
  }, [filePath]);

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
    // The handler reads current values from refs so it always acts on the latest content/filePath.
    let unlistenFn: (() => void) | null = null;

    (async () => {
      const unlisten = await once("save-triggered", async () => {
        try {
          const currentPath = filePathRef.current;
          const currentContent = contentRef.current;

          if (currentPath) {
            // save to existing file
            await saveExistingFile(currentPath, currentContent);
            console.log("File saved successfully");
          } else {
            // no file open — Save As
            const newPath = await saveFileAs(currentContent);
            if (newPath) {
              setFilePath(newPath);
              console.log("File saved as:", newPath);
            }
          }
        } catch (error) {
          console.error("Save failed:", error);
          // TODO: show a UI notification to the user
        }
      });

      unlistenFn = unlisten;
    })();

    return () => {
      if (unlistenFn) {
        try {
          unlistenFn();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [setFilePath]); // setFilePath stable; effect runs once

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
