import { db } from '~/utils/db.server';
import { Prisma, Session } from "@prisma/client";
import { nanoid } from 'nanoid'
import { getDay } from './slots';

export async function getSessions(): Promise<Session[]> {
    return await db.session.findMany();
}

function createNoteName() {
    const year = new Date().getFullYear();
    return `seneca-${year}-${nanoid(6)}`
}

export async function createSession(form: FormData) {
    const title = String(form.get("title"));
    const slot = +String(form.get("slot"));
    const room = String(form.get("room"));
    const noteName = createNoteName();
    const day = getDay();
    const note = new URL(noteName,'https://notes.stuve.fau.de/').toString()

    if (!title || !room) {
        throw Error("Missing required input!");
    }
    const session: Prisma.SessionCreateInput = { slot, title, room, note, day };

    let message = null;

    if (!await saveSession(session)) {
        message = `Entry at Room ${room}, Slot #${slot} already exists`;
    }
    return { message: message, title, slot, room };
}

async function saveSession(session: Prisma.SessionCreateInput): Promise<boolean> {
    const exists = await db.session.count({ where: { slot: session.slot, room: session.room } })
    if (exists) {
        return false
    }
    await db.session.create({ data: session })
    return true
}

export async function deleteSession(form: FormData) {
    const slot = +String(form.get("slot"));
    const room = String(form.get("room"));

    const sessionToDelete = await db.session.findFirst({ where: { room, slot } });
    if (!sessionToDelete) {
        throw Error(`No session found for slot:${slot} and room:${room}`);
    }
    await db.session.delete({ where: { id: sessionToDelete.id } })
    return {};
}

export async function switchSessions(form: FormData) {
    const firstSessionId = form.get("firstSessionId")?.toString();
    const secondSessionId = form.get("secondSessionId")?.toString();
    const firstSession = await db.session.findUniqueOrThrow({ where: { id: firstSessionId } });
    const secondSession = await db.session.findUniqueOrThrow({ where: { id: secondSessionId } });
    const firstRoom = firstSession.room;
    const firstSlot = firstSession.slot;
    await db.session.update({ data: { room: secondSession.room, slot: secondSession.slot }, where: { id: firstSessionId } });
    await db.session.update({ data: { room: firstRoom, slot: firstSlot }, where: { id: secondSessionId } });
    return {}
}

export async function moveSession(form: FormData) {
    const sessionId = form.get("sessionId")?.toString();
    const toSlot = parseInt(form.get("toSlot")?.toString() ?? "", 10);
    const toRoom = form.get("toRoom")?.toString();

    // TODO: Data validation

    if (isNaN(toSlot) || toRoom === undefined) {
        return {}
    }

    const session = await db.session.findUniqueOrThrow({ where: { id: sessionId } });
    await db.session.update({ data: { room: toRoom, slot: toSlot }, where: { id: session.id } });

    return {}
}

export async function renameSession(form: FormData) {
    const slot = parseInt(form.get("slot")?.toString() ?? "", 10);
    const room = String(form.get("room"));
    const title = String(form.get("title"));

    if ((title ?? "").trim().length == 0) {
        return {};
    }

    if (room === undefined || slot === undefined) {
        return {}
    }

    const source = await db.session.findFirst({ where: { room, slot }, })

    if (source === null) {
        return {}
    }

    await db.session.update({ data: { title }, where: { id: source.id }, })

    return {}
}
