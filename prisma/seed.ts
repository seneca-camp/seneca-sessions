import { PrismaClient, Schedule } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { rooms } from "../app/models/rooms";
import { getSlots, Slot } from "../app/models/slots";

const db = new PrismaClient();

const schedules = [
    {
        name: "Samstag '25",
        date: "2025-09-20",
        isPublic: true,
    },
    {
        name: "Sonntag '25",
        date: "2025-09-21",
        isPublic: true,
    }
]

async function main() {
    console.log("Seeding database...");
    await clearDatabase();

    for (const scheduleData of schedules) {
        const schedule = await db.schedule.create({
            data: {
                name: scheduleData.name,
                date: new Date(scheduleData.date),
                isPublic: scheduleData.isPublic
            }
        });
        await seedSessions(schedule);
    }

    console.log("Seed completed.");
}

async function seedSessions(schedule: Schedule) {
    const slots = getSlots(schedule);
    for (const slot of slots) {
        for (const room of rooms) {
            if (probability(0.3)) {
                continue;
            }
            await seedSession({ schedule, slot, room });
        }
    }
}

async function seedSession({ schedule, slot, room }: { schedule: Schedule, slot: Slot, room: string }) {
    return db.session.create({
        data: {
            title: faker.lorem.sentence({ min: 3, max: 8 }),
            room,
            slot: slot.id,
            note: buildNoteUrl(),
            schedule: { connect: { id: schedule.id } },
        },
    });
}

function probability(value: number) {
    return Math.random() < value;
}

function buildNoteUrl(): string {
    const year = new Date().getFullYear();
    const slug = faker.string.alphanumeric({ length: 6 }).toLowerCase();
    return new URL(`seneca-${year}-${slug}`, "https://notes.stuve.fau.de/").toString();
}

async function clearDatabase() {
    await db.session.deleteMany();
    await db.schedule.deleteMany();
}

main()
    .catch(console.error)
    .finally(async () => { await db.$disconnect(); });