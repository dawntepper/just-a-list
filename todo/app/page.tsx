import React from "react";
import dynamic from "next/dynamic";

const TodoList = dynamic(
  () => import("@/components/enhanced-todo-list-creator"),
  { ssr: false }
);

export function generateStaticParams() {
  return [{ slug: "" }, { slug: ["sidepanel"] }];
}

export default function Home() {
  return (
    <div className="p-4 h-screen overflow-auto">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <TodoList isPremium={true} />
    </div>
  );
}
