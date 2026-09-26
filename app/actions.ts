"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { todosCollection } from "@/lib/todos";

export type ActionState = { error?: string };

function parseId(formData: FormData) {
  const id = formData.get("id");
  if (typeof id !== "string" || !ObjectId.isValid(id)) {
    throw new Error("Invalid todo id");
  }
  return new ObjectId(id);
}

function parseTitle(formData: FormData) {
  const title = formData.get("title");
  if (typeof title !== "string") return null;
  const trimmed = title.trim();
  if (!trimmed || trimmed.length > 200) return null;
  return trimmed;
}

export async function createTodo(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const title = parseTitle(formData);
  if (!title) return { error: "กรุณากรอกชื่องาน (ไม่เกิน 200 ตัวอักษร)" };

  const col = await todosCollection();
  const now = new Date();
  await col.insertOne({
    _id: new ObjectId(),
    title,
    completed: false,
    createdAt: now,
    updatedAt: now,
  });
  revalidatePath("/");
  return {};
}

export async function updateTodo(formData: FormData) {
  const _id = parseId(formData);
  const title = parseTitle(formData);
  if (!title) return;

  const col = await todosCollection();
  await col.updateOne({ _id }, { $set: { title, updatedAt: new Date() } });
  revalidatePath("/");
}

export async function toggleTodo(formData: FormData) {
  const _id = parseId(formData);
  const completed = formData.get("completed") === "true";

  const col = await todosCollection();
  await col.updateOne(
    { _id },
    { $set: { completed: !completed, updatedAt: new Date() } }
  );
  revalidatePath("/");
}

export async function deleteTodo(formData: FormData) {
  const _id = parseId(formData);
  const col = await todosCollection();
  await col.deleteOne({ _id });
  revalidatePath("/");
}
