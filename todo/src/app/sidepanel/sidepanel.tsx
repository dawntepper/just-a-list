"use client";

import React from "react";
import EnhancedTodoListCreator from "@/components/enhanced-todo-list-creator";

export default function SidePanel() {
  return (
    <div className="w-[300px] h-screen bg-white dark:bg-gray-800 overflow-y-auto">
      <EnhancedTodoListCreator isPremium={false} />
    </div>
  );
}
