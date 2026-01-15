import { open, save } from "@tauri-apps/plugin-dialog";

export async function openFileDialog(): Promise<string | null> {
  try {
    const selected = await open({
      multiple: false,
      directory: false,
      filters: [
        {
          name: "Markdown",
          extensions: ["md", "markdown", "txt"],
        },
      ],
    });

    return Array.isArray(selected) ? selected[0] : selected;
  } catch (error) {
    console.error("Error opening file dialog: ", error);
    return null;
  }
}

export async function saveFileDialog(
  defaultName?: string,
): Promise<string | null> {
  try {
    const selected = await save({
      defaultPath: defaultName || "untitled.md",
      filters: [
        {
          name: "Markdown",
          extensions: ["md", "markdown"],
        },
      ],
    });

    return selected;
  } catch (error) {
    console.error("Error opening save dialog: ", error);
    return null;
  }
}
