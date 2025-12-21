import { Room } from "@prisma/client";
import { db } from "~/utils/db.server";

export const DEFAULT_ROOMS: string[] = [
  "Diogenes' Fass",
  "Putnams Tank",
  "Searles Chinesischer Raum",
  "Theseus' Schiff",
  "Schrödingers Box",
  "Platons Höhle",
  "Stoa",
  "Agora",
];

export async function getRooms(): Promise<Room[]> {
  const roomClient = db.room as {
    findMany: (args: unknown) => Promise<Room[]>;
  };
  return await roomClient.findMany({ orderBy: { position: "asc" } });
}

export async function getRoomNames(): Promise<string[]> {
  const rooms = await getRooms();
  return rooms.map((r) => r.name);
}

export async function createRoom(
  name: string,
): Promise<Room | { error: string }> {
  const trimmed = (name ?? "").trim();
  if (!trimmed) {
    return { error: "Name is required" };
  }
  const roomClient = db.room;
  const exists = await roomClient.findFirst({ where: { name: trimmed } });
  if (exists) {
    return { error: "Room already exists" };
  }
  const max = await roomClient.aggregate({ _max: { position: true } });
  const nextPosition = (max._max.position ?? -1) + 1;
  return await roomClient.create({
    data: { name: trimmed, position: nextPosition },
  });
}

export async function renameRoom(id: string, name: string) {
  const trimmed = (name ?? "").trim();
  if (!trimmed) {
    return { error: "Name is required" };
  }
  const roomClient = db.room;
  const dup = await roomClient.findFirst({
    where: { name: trimmed, NOT: { id } },
  });
  if (dup) {
    return { error: "Room with this name already exists" };
  }
  await roomClient.update({ where: { id }, data: { name: trimmed } });
}

export async function deleteRoom(id: string) {
  const roomClient = db.room;
  await roomClient.delete({ where: { id } });
}

export async function moveRoomUp(id: string) {
  const roomClient = db.room;
  const current = await roomClient.findUniqueOrThrow({ where: { id } });
  const above = await roomClient.findFirst({
    where: { position: { lt: current.position } },
    orderBy: { position: "desc" },
  });
  if (!above) return;
  await swapPositions(current, above);
}

export async function moveRoomDown(id: string) {
  const roomClient = db.room;
  const current = await roomClient.findUniqueOrThrow({ where: { id } });
  const below = await roomClient.findFirst({
    where: { position: { gt: current.position } },
    orderBy: { position: "asc" },
  });
  if (!below) return;
  await swapPositions(current, below);
}

async function swapPositions(a: Room, b: Room) {
  await db.$transaction(async (tx) => {
    const roomClient = tx.room;
    const max = await roomClient.aggregate({ _max: { position: true } });
    const temp = (max._max.position ?? -1) + 1;

    await roomClient.update({ where: { id: a.id }, data: { position: temp } });
    await roomClient.update({
      where: { id: b.id },
      data: { position: a.position },
    });
    await roomClient.update({
      where: { id: a.id },
      data: { position: b.position },
    });
  });
}
