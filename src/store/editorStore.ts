import { create } from "zustand"; // Zustand's core features like 'set()' belong to 'create()'
import { devtools } from "zustand/middleware"; // Google Chrome DevTools extension

interface EditorState {
  // foundational state values, not essential for file to exist
  content: string;
  filePath: string | null;
  fileName: string;
  hasUnsavedChanges: boolean;
  // functional state values, not essential for file to exist
  setContent: (content: string) => void;
  setFilePath: (path: string | null) => void;
  setFileName: (name: string) => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  newFile: () => void;
  loadFile: (path: string, content: string, name: string) => void;
  reset: () => void;
}

// Constructor of the foundational state values
const initialState = {
  content: "",
  filePath: null,
  fileName: "untitled.md",
  hasUnsavedChanges: false,
};

export const useEditorStore = create<EditorState>()(
  devtools((set) => ({
    ...initialState,

    //Actions
    setContent: (content) => set({ content, hasUnsavedChanges: true }),

    setFilePath: (filePath) => set({ filePath }),

    setFileName: (fileName) => set({ fileName }),

    setHasUnsavedChanges: (hasUnsavedChanges) => set({ hasUnsavedChanges }),

    newFile: () =>
      set({
        content: "",
        filePath: null,
        fileName: "untitled.md",
        hasUnsavedChanges: false,
      }),

    loadFile: (filePath, content, fileName) =>
      set({
        filePath,
        content,
        fileName,
        hasUnsavedChanges: false,
      }),

    reset: () => set(initialState),
  })),
);
