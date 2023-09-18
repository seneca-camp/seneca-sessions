import { rooms } from "~/utils/rooms";
import { slots } from "~/utils/slots";

export type Entry = {
    slot: number,
    name: string,
    room: string,
}

export function getCorrectSession(room: string, slot: number, entries: [Entry]): string {
    const entry = entries.find(element => element.room === room && element.slot === slot);
    return (entry !== undefined ? entry.name : "");
}

export function getEntriesForSlot(slot: number, entries: [Entry]): Entry[] {
    let entryNames: Entry[] = [];
    rooms.forEach(room => {
        const name = getCorrectSession(room, slot, entries);
        entryNames.push({name: name, room: room, slot: slot})
    })
    return entryNames;
}