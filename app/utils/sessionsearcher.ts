import { rooms } from '~/utils/rooms';

export type Entry = { // TODO: Use prisma entity
    id?: number,
    slot: number,
    name: string,
    room: string,
}

export function getCorrectSession(room: string, slot: number, entries: Entry[]): Entry | undefined {
    return entries.find(element => element.room === room && element.slot === slot);
}

export function getEntriesForSlot(slot: number, entries: Entry[]): Entry[] {
    let entriesOfSlot: Entry[] = [];
    rooms.forEach(room => {
        const entry = getCorrectSession(room, slot, entries);
        if (entry !== undefined) {
            entriesOfSlot.push({ ...entry })
        } else {
            entriesOfSlot.push({ room, slot, name: "" })
        }
    })
    return entriesOfSlot;
}