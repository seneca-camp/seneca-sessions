import { Schedule } from "@prisma/client";
import { db } from "~/utils/db.server";

export async function getSchedule(scheduleId: string): Promise<Schedule> {
    return await db.schedule.findUniqueOrThrow({ where: { id: scheduleId } });
}

export async function getPublicSchedules(): Promise<Schedule[]> {
    return await db.schedule.findMany({ where: { isPublic: true }, orderBy: { date: "asc" } });
}