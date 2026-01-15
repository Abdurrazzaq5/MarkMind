import { invoke } from "@tauri-apps/api/core";
import { openFileDialog, saveFileDialog } from "./dialogs";

export interface FileData {
  path: string;
  content: string;
  name: string;
}

export async function loadFile(): Promise<FileData | null> {
  const filePath = await openFileDialog();
  if (!filePath) return null;

  try {
    const content = await invoke<string>("open_file", {
      path: filePath,
    });

    const fileName = filePath.split(/[\\/]/).pop() || "untitled.md";

    return {
      path: filePath,
      content,
      name: fileName,
    };
  } catch (error) {
    console.error("Failed to load file: ", error);
    throw new Error(`Failed to load file: ${error}`);
  }
}

export async function saveFileAs(
  content: string,
  currentPath?: string,
): Promise<string | null> {
  const defaultName = currentPath?.split(/[\\/]/).pop();

  const savePath = await saveFileDialog(defaultName);
  if (!savePath) return null;

  try {
    await invoke("save_file", {
      path: savePath,
      content,
    });
    return savePath;
  } catch (error) {
    console.error("Failed to save file: ", error);
    throw new Error(`Failed to save file: ${error}`);
  }
}

export async function saveExistingFile(
  path: string,
  content: string,
): Promise<void> {
  try {
    await invoke("save_file", { path, content });
  } catch (error) {
    console.error("Failed to save file: ", error);
    throw new Error(`Failed to save file: ${error}`);
  }
}
