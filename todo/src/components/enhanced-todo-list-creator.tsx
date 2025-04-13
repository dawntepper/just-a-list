"use client";

import React, { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Plus, Cloud, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";

interface Task {
  id: string;
  text: string;
  completed: boolean;
  category: string;
}

interface TodoListProps {
  isPremium: boolean;
}

const categories = ["Work", "Personal", "Shopping", "Other"];

const EnhancedTodoListCreator: React.FC<TodoListProps> = ({
  isPremium = false,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState(categories[0]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await new Promise<{ tasks: Task[] | undefined }>(
        (resolve) => {
          chrome.storage?.local.get(["tasks"], (data) =>
            resolve(data as { tasks: Task[] | undefined })
          );
        }
      );
      if (result.tasks) {
        setTasks(result.tasks);
      }
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
      console.error("Error loading tasks:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTasks = async (updatedTasks: Task[]) => {
    setError(null);
    try {
      await new Promise<void>((resolve, reject) => {
        chrome.storage?.local.set({ tasks: updatedTasks }, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            resolve();
          }
        });
      });
      setTasks(updatedTasks);
      if (isPremium) {
        // Simulate cloud sync for premium users
        await new Promise((resolve) => setTimeout(resolve, 500));
        toast.success("Tasks synced to cloud");
      }
    } catch (err) {
      setError("Failed to save tasks. Please try again.");
      console.error("Error saving tasks:", err);
    }
  };

  const addTask = () => {
    if (newTaskText.trim() !== "") {
      const newTask: Task = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: newTaskText.trim(),
        completed: false,
        category: newTaskCategory,
      };
      saveTasks([...tasks, newTask]);
      setNewTaskText("");
    }
  };

  const toggleTask = (id: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks(updatedTasks);
  };

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    saveTasks(updatedTasks);
  };

  const createTasksFromInput = () => {
    const newTasks = inputText
      .split(/\n|•|-/)
      .map((task) => task.trim())
      .filter((task) => task !== "")
      .map((task) => ({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        text: task,
        completed: false,
        category: newTaskCategory,
      }));
    saveTasks([...tasks, ...newTasks]);
    setInputText("");
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    saveTasks(items);
  };

  if (isLoading) {
    return <div className="p-4">Loading tasks...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 flex items-center">
        <AlertCircle className="w-5 h-5 mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="p-4 h-full overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4">
        {isPremium ? "Premium" : "Basic"} Todo List
      </h1>
      <div className="space-y-4">
        <div>
          <Label htmlFor="new-task">Add New Task</Label>
          <div className="flex mt-1">
            <Input
              id="new-task"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="Enter a new task"
              onKeyPress={(e) => e.key === "Enter" && addTask()}
              className="flex-grow"
            />
            <Select value={newTaskCategory} onValueChange={setNewTaskCategory}>
              <SelectTrigger className="w-[180px] ml-2">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addTask} className="ml-2">
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </div>

        <div>
          <Label htmlFor="task-list">Your Tasks</Label>
          <Card className="mt-1">
            <CardContent className="p-2 max-h-60 overflow-y-auto">
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="tasks">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {tasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`flex items-center space-x-2 mb-2 ${
                                index % 2 === 0 ? "bg-gray-50" : "bg-white"
                              } p-2 rounded`}
                            >
                              <Checkbox
                                id={`task-${task.id}`}
                                checked={task.completed}
                                onCheckedChange={() => toggleTask(task.id)}
                              />
                              <label
                                htmlFor={`task-${task.id}`}
                                className={`flex-grow ${
                                  task.completed
                                    ? "line-through text-gray-500"
                                    : "text-gray-900"
                                }`}
                              >
                                {task.text}
                              </label>
                              <span className="text-sm text-gray-500">
                                {task.category}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteTask(task.id)}
                                aria-label={`Delete task: ${task.text}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </CardContent>
          </Card>
        </div>

        <div>
          <Label htmlFor="bulk-input">Bulk Add Tasks</Label>
          <Textarea
            id="bulk-input"
            placeholder="Enter tasks (one per line)"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="mt-1 min-h-[100px]"
          />
          <div className="flex mt-2">
            <Select value={newTaskCategory} onValueChange={setNewTaskCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={createTasksFromInput} className="ml-2 flex-grow">
              Create Tasks
            </Button>
          </div>
        </div>

        {isPremium && (
          <div className="flex items-center space-x-2 text-blue-600">
            <Cloud className="w-4 h-4" />
            <span>Synced to cloud</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedTodoListCreator;
