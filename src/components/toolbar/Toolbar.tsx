import { useEditorStore } from "@/store/editorStore";
import { handleOpenFile, handleSaveFile } from "@/lib/fileOperations";

export function Toolbar() {
  const newFile = useEditorStore((state) => state.newFile);
  const hasUnsavedChanges = useEditorStore((state) => state.hasUnsavedChanges);

  const handleNewFile = () => {
    //Confirm if there are unsaved files
    if (hasUnsavedChanges) {
      const confirmed = window.confirm(
        "You have unsaved changes. Create a new file anyway?",
      );
      if (!confirmed) return;
    }
    newFile();
  };

  return (
    <div className="flex page-2 p-2 bg-gray-100 border-b">
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={handleNewFile}
      >
        New File
      </button>
      <button
        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        onClick={handleOpenFile}
      >
        Open
      </button>
      <button
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        onClick={handleSaveFile}
      >
        Save
      </button>
    </div>
  );
}
