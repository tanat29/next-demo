"use client";

import { useState } from "react";
import { deleteTodo, toggleTodo, updateTodo } from "./actions";
import type { Todo } from "@/lib/todos";

export function TodoItem({ todo }: { todo: Todo }) {
  const [editing, setEditing] = useState(false);

  return (
    <li className="flex items-center gap-3 rounded-lg border border-zinc-200 px-3 py-2 dark:border-zinc-800">
      <form action={toggleTodo}>
        <input type="hidden" name="id" value={todo.id} />
        <input type="hidden" name="completed" value={String(todo.completed)} />
        <button
          type="submit"
          aria-label={todo.completed ? "ยกเลิกเสร็จ" : "ทำเครื่องหมายว่าเสร็จ"}
          className={`flex h-5 w-5 items-center justify-center rounded border text-xs ${
            todo.completed
              ? "border-green-600 bg-green-600 text-white"
              : "border-zinc-400"
          }`}
        >
          {todo.completed && "✓"}
        </button>
      </form>

      {editing ? (
        <form
          action={async (formData) => {
            await updateTodo(formData);
            setEditing(false);
          }}
          className="flex flex-1 gap-2"
        >
          <input type="hidden" name="id" value={todo.id} />
          <input
            name="title"
            defaultValue={todo.title}
            maxLength={200}
            required
            autoFocus
            className="flex-1 rounded border border-zinc-300 bg-white px-2 py-1 text-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
          />
          <button type="submit" className="text-sm font-medium text-blue-600">
            บันทึก
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="text-sm text-zinc-500"
          >
            ยกเลิก
          </button>
        </form>
      ) : (
        <>
          <span
            className={`flex-1 break-all ${
              todo.completed ? "text-zinc-400 line-through" : ""
            }`}
          >
            {todo.title}
          </span>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-sm text-blue-600"
          >
            แก้ไข
          </button>
          <form action={deleteTodo}>
            <input type="hidden" name="id" value={todo.id} />
            <button type="submit" className="text-sm text-red-600">
              ลบ
            </button>
          </form>
        </>
      )}
    </li>
  );
}
