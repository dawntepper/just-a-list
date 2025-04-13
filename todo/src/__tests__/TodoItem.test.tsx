import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TodoItem from "../components/TodoItem";

describe("TodoItem", () => {
  const mockTodo = {
    id: "1",
    text: "Test todo",
    completed: false,
    createdAt: new Date().toISOString(),
  };

  const mockOnToggle = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnEdit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders todo text", () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
        index={0}
      />
    );
    expect(screen.getByText("Test todo")).toBeInTheDocument();
  });

  it("calls onToggle when checkbox is clicked", () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
        index={0}
      />
    );
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(mockOnToggle).toHaveBeenCalledWith("1");
  });

  it("calls onDelete when delete button is clicked", () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
        index={0}
      />
    );
    const deleteButton = screen.getByRole("button", { name: /delete/i });
    fireEvent.click(deleteButton);
    expect(mockOnDelete).toHaveBeenCalledWith("1");
  });
});
