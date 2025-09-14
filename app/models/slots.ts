import { Schedule } from "@prisma/client";

export type Slot = {
  id: number;
  time: string;
};

export function getSlots(schedule: Schedule): Slot[] {
  if (schedule.date.getDay() === 0) {
    return sundaySlots;
  }
  return saturdaySlots;
}

export const saturdaySlots: Slot[] = [
  { id: 0, time: "11:00 - 11:45" },
  { id: 1, time: "12:00 - 12:45" },
  { id: 2, time: "13:00 - 14:00" },
  { id: 3, time: "14:00 - 14:45" },
  { id: 4, time: "15:00 - 15:45" },
  { id: 5, time: "16:00 - 16:45" },
  { id: 6, time: "17:00 - 17:45" },
];

export const sundaySlots: Slot[] = [
  { id: 0, time: "10:00 - 10:45" },
  { id: 1, time: "11:00 - 11:45" },
  { id: 2, time: "12:00 - 12:45" },
];
