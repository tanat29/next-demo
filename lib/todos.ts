import "server-only";
import { ObjectId } from "mongodb";
import { getDb } from "./mongodb";

export type TodoDoc = {
  _id: ObjectId;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

export async function todosCollection() {
  const db = await getDb();
  return db.collection<TodoDoc>("todos");
}

export async function getTodos(): Promise<Todo[]> {
  const col = await todosCollection();
  const docs = await col.find().sort({ createdAt: -1 }).toArray();
  return docs.map((d) => ({
    id: d._id.toString(),
    title: d.title,
    completed: d.completed,
    createdAt: d.createdAt.toISOString(),
  }));
}
