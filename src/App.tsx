import { SplitLayout } from "./components/Layout/SplitLayout";
import { FileTree } from "./components/sidebar/FileTree";
import MarkdownEditor from "./components/editor/MarkdownEditor";
import { useEditorStore } from "./store/editorStore";
import { useEffect } from "react";
import { UnsavedIndicator } from "./components/unsaved/UnsavedIndicator";

function App() {
  const hasUnsavedChanges = useEditorStore((state) => state.hasUnsavedChanges);

  // Warn user before closing window with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        // Modern browsers ignore custom messages, but setting returnValue triggers the dialog
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  return (
    <div className="app">
      <UnsavedIndicator />
      <SplitLayout editor={<MarkdownEditor />} sidebar={<FileTree />} />
    </div>
  );
}

export default App;
