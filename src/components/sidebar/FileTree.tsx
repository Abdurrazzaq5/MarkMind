import { File, Folder, Plus } from "lucide-react";

export function FileTree() {
  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          <Plus size={18} />
          <span>New File</span>
        </button>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {/* Placeholder items */}
          <TreeItem icon={<Folder />} label="Documents" />
          <TreeItem icon={<File />} label="README.md" indent={1} />
          <TreeItem icon={<File />} label="notes.md" indent={1} />
        </div>
      </div>
    </div>
  );
}

interface TreeItemProps {
  icon: React.ReactNode;
  label: string;
  indent?: number;
}

function TreeItem({ icon, label, indent = 0 }: TreeItemProps) {
  return (
    <div
      className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer transition-colors"
      style={{ paddingLeft: `${8 + indent * 16}px` }}
    >
      <span className="text-gray-600 dark:text-gray-400">{icon}</span>
      <span className="text-sm text-gray-900 dark:text-gray-100">{label}</span>
    </div>
  );
}
