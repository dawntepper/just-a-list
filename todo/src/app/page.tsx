import React from "react";
import { createRoot } from "react-dom/client";
import dynamic from "next/dynamic";
import "../styles/globals.css";

const EnhancedTodoListCreator = dynamic(
  () => import("../components/enhanced-todo-list-creator"),
  {
    loading: () => <div>Loading...</div>,
    ssr: false,
  }
);

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <EnhancedTodoListCreator isPremium={true} />
    </React.StrictMode>
  );
}
