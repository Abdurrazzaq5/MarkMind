import { SplitLayout } from "./components/Layout/SplitLayout";
import { FileTree } from "./components/sidebar/FileTree";
import MarkdownEditor from "./components/editor/MarkdownEditor";

function App() {
  return <SplitLayout sidebar={<FileTree />} editor={<MarkdownEditor />} />;
}

export default App;
