import { Schedule } from "~/generated/client";
import { db } from "~/utils/db.server";

export async function getSchedule(scheduleId: string): Promise<Schedule> {
  return await db.schedule.findUniqueOrThrow({ where: { id: scheduleId } });
}

export type PublicSchedule = Awaited<
  ReturnType<typeof getPublicSchedules>
>[number];

export async function getPublicSchedules() {
  return await db.schedule.findMany({
    where: { isPublic: true },
    orderBy: { date: "asc" },
    include: { sessions: true },
  });
}

export async function toggleVisibility(form: FormData) {
  const scheduleId = form.get("scheduleId")?.toString();
  const schedule = await db.schedule.findUniqueOrThrow({
    where: { id: scheduleId },
  });
  await db.schedule.update({
    where: { id: scheduleId },
    data: { isPublic: !schedule.isPublic },
  });
}

export async function createSchedule(form: FormData) {
  const name = form.get("name")?.toString() ?? "";
  const dateInput = form.get("date")?.toString() ?? "";

  if (!name.trim() || !dateInput.trim()) {
    return { error: "Name and date are required." };
  }

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) {
    return { error: "Invalid date format." };
  }

  return await db.schedule.create({ data: { name, date } });
}

export async function deleteSchedule(form: FormData) {
  const scheduleId = String(form.get("id"));
  await db.session.deleteMany({ where: { scheduleId } });
  await db.schedule.delete({ where: { id: scheduleId } });
}
