import { useState } from "react";
import { SplitPane, Pane } from "react-split-pane";
import "react-split-pane/styles.css";

interface SplitLayoutProps {
  sidebar: React.ReactNode;
  editor: React.ReactNode;
}

export function SplitLayout({ sidebar, editor }: SplitLayoutProps) {
  // Store pane sizes in state (in pixels or percentages)
  const [sizes, setSizes] = useState([200, 400, 400]);

  return (
    <div className="h-screen w-screen overflow-hidden">
      <SplitPane direction="horizontal" onResize={setSizes}>
        <Pane size={sizes[0]} minSize="150px" defaultSize={200}>
          {/* File tree will go here */}
          <div>{sidebar}</div>
        </Pane>
        <Pane minSize={300} defaultSize={800}>
          {/* Markdown textarea will go here */}
          <div>{editor}</div>
        </Pane>
      </SplitPane>
    </div>
  );
}
