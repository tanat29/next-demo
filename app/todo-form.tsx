"use client";

import { useActionState, useEffect, useRef } from "react";
import { createTodo, type ActionState } from "./actions";

export function TodoForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    createTodo,
    {}
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!pending && !state.error) formRef.current?.reset();
  }, [pending, state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input
          name="title"
          placeholder="เพิ่มงานใหม่..."
          maxLength={200}
          required
          className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-black outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-foreground px-4 py-2 font-medium text-background disabled:opacity-50"
        >
          {pending ? "กำลังเพิ่ม..." : "เพิ่ม"}
        </button>
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
