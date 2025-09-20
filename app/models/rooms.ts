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
