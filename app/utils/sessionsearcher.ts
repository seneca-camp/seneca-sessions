import { Session } from '@prisma/client';
import { rooms } from '~/models/rooms';

export function getCorrectSession(room: string, slot: number, sessions: Session[]): Session | undefined {
    return sessions.find(element => element.room === room && element.slot === slot);
}

// ToDo: get rid of this method :)
export function getSessionsForSlot(slot: number, sessions: Session[]): Session[] {
    let sessionsOfSlot: Session[] = [];
    rooms.forEach(room => {
        const entry = getCorrectSession(room, slot, sessions);
        if (entry !== undefined) {
            sessionsOfSlot.push({ ...entry });
        } else {
            sessionsOfSlot.push({ room, slot, title: "", id: "" });
        }
    })
    return sessionsOfSlot;
}