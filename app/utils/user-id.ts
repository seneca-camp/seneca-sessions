import { nanoid } from "nanoid";

export function getRandomUserId(): string {
  const storageKey = "user-id";
  const existing = window.localStorage.getItem(storageKey);
  if (existing && existing.trim().length > 0) {
    return existing;
  }
  const newId = `uid_${nanoid(16)}`;
  window.localStorage.setItem(storageKey, newId);
  return newId;
}


