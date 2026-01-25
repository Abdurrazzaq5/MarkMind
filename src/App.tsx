import { SplitLayout } from "./components/Layout/SplitLayout";
import { FileTree } from "./components/sidebar/FileTree";
import MarkdownEditor from "./components/editor/MarkdownEditor";
import { UnsavedIndicator } from "./components/unsaved/UnsavedIndicator";
import { APIKeySetup } from "./components/api-setup/APIKeySetup";
import { AIActions } from "./components/AIActions/AIActions";
import { Toolbar } from "./components/toolbar/Toolbar";

function App() {
  return (
    <div className="flex flex-col h-screen">
      <APIKeySetup />
      <AIActions />
      <Toolbar />
      <UnsavedIndicator />
      <SplitLayout editor={<MarkdownEditor />} sidebar={<FileTree />} />
    </div>
  );
}

export default App;
