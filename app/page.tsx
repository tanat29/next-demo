import { connection } from "next/server";
import { isMongoConfigured } from "@/lib/mongodb";
import { getTodos, type Todo } from "@/lib/todos";
import { TodoForm } from "./todo-form";
import { TodoItem } from "./todo-item";

export default async function Home() {
  await connection();

  let todos: Todo[] = [];
  let error: string | null = null;

  if (!isMongoConfigured()) {
    error = "ยังไม่ได้ตั้งค่า MONGODB_URI — กรุณาใส่ใน .env.local แล้วรีสตาร์ท dev server";
  } else {
    try {
      todos = await getTodos();
    } catch (e) {
      console.error(e);
      error = "เชื่อมต่อ MongoDB ไม่สำเร็จ กรุณาตรวจสอบ MONGODB_URI";
    }
  }

  const done = todos.filter((t) => t.completed).length;

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-2xl flex-col gap-6 bg-white px-6 py-16 text-black dark:bg-black dark:text-zinc-50">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Todo List</h1>
          {!error && (
            <p className="mt-1 text-sm text-zinc-500">
              เสร็จแล้ว {done} / {todos.length} งาน
            </p>
          )}
        </div>

        {error ? (
          <p className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
            {error}
          </p>
        ) : (
          <>
            <TodoForm />
            {todos.length === 0 ? (
              <p className="text-center text-zinc-500">ยังไม่มีงาน</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {todos.map((todo) => (
                  <TodoItem key={todo.id} todo={todo} />
                ))}
              </ul>
            )}
          </>
        )}
      </main>
    </div>
  );
}
