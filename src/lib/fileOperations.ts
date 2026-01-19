import { invoke } from "@tauri-apps/api/core";
import { openFileDialog, saveFileDialog } from "./dialogs";
import { useEditorStore } from "@/store/editorStore";

export async function handleOpenFile() {
  const filePath = await openFileDialog();
  if (!filePath) return;

  try {
    const content = await invoke<string>("open_file", { path: filePath });
    const fileName = filePath.split(/[\\/]/).pop() || "untitled.md";

    // Update store
    useEditorStore.getState().loadFile(filePath, content, fileName);
  } catch (error) {
    console.error("Failed to load file:", error);
    throw error;
  }
}

export async function handleSaveFile() {
  const { filePath, content, setFilePath, setFileName, setHasUnsavedChanges } =
    useEditorStore.getState();

  try {
    if (filePath) {
      // Save to existing file
      await invoke("save_file", { path: filePath, content });
      setHasUnsavedChanges(false);
    } else {
      // Save as new file
      const newPath = await saveFileDialog();
      if (!newPath) return;

      await invoke("save_file", { path: newPath, content });

      const newFileName = newPath.split(/[\\/]/).pop() || "untitled.md";
      setFilePath(newPath);
      setFileName(newFileName);
      setHasUnsavedChanges(false);
    }
  } catch (error) {
    console.error("Failed to save file:", error);
    throw error;
  }
}
