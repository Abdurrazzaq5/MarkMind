import { useEditorStore } from "@/store/editorStore";

export function UnsavedIndicator() {
  const hasUnsavedChanges = useEditorStore((state) => state.hasUnsavedChanges);
  const fileName = useEditorStore((state) => state.fileName);

  if (!hasUnsavedChanges) return null;

  return (
    <div className="flex items-center gap-2 text-amber-500">
      <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
      <span className="text-sm">{fileName} has unsaved changes</span>
    </div>
  );
}
