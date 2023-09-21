import { useState } from 'react';
import { db } from '~/utils/db.server';
import { rooms } from '~/utils/rooms';
import { Entry, getEntriesForSlot } from '~/utils/sessionsearcher';
import { Slot, slots } from '~/utils/slots';

import { json } from '@remix-run/node';
import { useActionData, useLoaderData } from '@remix-run/react';

import style from './admin.index.module.css';

import type { ActionFunctionArgs } from "@remix-run/node";
async function saveEntry(entry: Entry): boolean {
    const exists = await db.session.count({ where: { slot: entry.slot, room: entry.room } })
    if (exists) {
        return false
    }
    await db.session.create({ data: entry })
    return true
}

async function create(form: FormData) {
    const name = form.get("name");
    const slot = +form.get("slot");
    const room = form.get("room");
    const entry = { slot, name, room };

    let message = null;

    if (!await saveEntry(entry)) {
        message = `Entry at Room ${room}, Slot #${slot} already exists`;
    }
    return { message: message, name: name, slot: slot, room: room };
}

async function deleteEntry(form: FormData) {
    const slot = +form.get("slot");
    const room = form.get("room");

    const entryToDelete = await db.session.findFirst({ where: { room: room, slot: slot }, })

    await db.session.delete({ where: { id: entryToDelete.id } })
    return {}
}

async function moveEntry(form: FormData) {
    const fromSlot = parseInt(form.get("fromSlot")?.toString() ?? "", 10);
    const fromRoom = form.get("fromRoom")?.toString();
    const toSlot = parseInt(form.get("toSlot")?.toString() ?? "", 10);
    const toRoom = form.get("toRoom")?.toString();

    // TODO: Data validation

    if (isNaN(fromSlot) || fromRoom === undefined || isNaN(toSlot) || toRoom === undefined) {
        return {}
    }

    const source = await db.session.findFirst({ where: { room: fromRoom.toString(), slot: fromSlot }, })
    const target = await db.session.findFirst({ where: { room: toRoom, slot: toSlot }, })

    if (source === null) {
        return {}
    }

    await db.session.update({ data: { room: toRoom, slot: toSlot }, where: { id: source.id } })
    if (target !== null) {
        await db.session.update({ data: { room: fromRoom, slot: fromSlot }, where: { id: target.id } })
    }

    return {}
}

export const action = async ({
    request,
}: ActionFunctionArgs) => {
    const form = await request.formData();
    const type = form.get("type");

    if (type === "create") {
        return await create(form)
    }
    else if (type === "delete") {
        return await deleteEntry(form)
    }
    else if (type === "move") {
        return await moveEntry(form)
    }
};

export const loader = async () => {
    return json({
        sessions: await db.session.findMany(),
    });
};


export default function IndexRoute() {
    const actionData = useActionData<typeof action>();
    const sessiondata = useLoaderData<typeof loader>();
    return <div><h1 className="mb-4 text-2xl font-bold leading-none tracking-tight text-grey">Edit Mode</h1>
        <div>
            {actionData ? <p className="text-deeppurple">{actionData.message}</p> : ""}
            <form className="max-w-md bg-white shadow-md rounded px-8 pt-12 pb-8 mb-4" method="post" action="/admin/">
                <div>
                    <label className="block text-gray-700 text-md font-bold mb-2">
                        Name: <input type="text" name="name" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue={actionData?.message ? actionData.name : ""} />
                    </label>
                </div>
                <div>
                    <label className="block text-gray-700 text-md font-bold mb-2">
                        Slot: <input type="number" name="slot" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" min={slots[0].id} max={slots.slice(-1)[0].id} defaultValue={actionData?.message ? actionData.slot : ""} />
                    </label>
                </div>
                <div>
                    <label className="block text-gray-700 text-md font-bold mb-2">
                        Room: <select id="room" name="room" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue={actionData?.message ? actionData.room : ""}>
                            {rooms.map((room) => (
                                <option key={"r" + room} value={room}>{room}</option>
                            ))}
                        </select>
                    </label>
                </div>
                <input type="hidden" name="type" value="create" />
                <div>
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Add
                    </button>
                </div>
            </form>
        </div>
        <div className="overflow-x">
            <table className="w-full text-base text-center text-black table-auto border overflow-scroll">
                <thead className="text-lg text-white uppercase bg-fancyorange">
                    <tr key="table-head" className="divide-x">
                        <th key="head-1"></th>
                        {rooms.map((room) => (
                            <th key={room}>{room}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="[&>*:nth-child(odd)]:bg-brightpetrole  [&>*:nth-child(even)]:bg-white">
                    {slots.map(({ id, time }) => (
                        <tr className="min-h-100 divide-x" key={"row" + id}>
                            <td className="text-lg font-bold" key={id}>{time} #{id}</td>
                            {getEntriesForSlot(id, sessiondata.sessions).map(({ name, slot, room }) => (
                                <td key={id + name}><p>{name} {(name !== "") ? <><DeleteForm id={id} room={room} /> <MoveForm id={id} room={room} allSlots={slots} /></> : ""}</p></td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
}

function DeleteForm(props: { id: number, room: string }) {
    const [isCollapsed, setCollapsed] = useState(true)

    return <form className={`${style.slotForm} ${isCollapsed ? style.collapsed : style.uncollapsed}`} method="post" action="/admin/">
        <span className={style.showForm} onClick={() => setCollapsed(!isCollapsed)}>Diesen Slot leeren:</span>
        <input type="hidden" name="type" value="delete" />
        <input type="hidden" name="slot" value={props.id} />
        <input type="hidden" name="room" value={props.room} />
        <button type="submit">Eintrag löschen</button>
    </form>
}

function MoveForm(props: { allSlots: Slot[], id: number, room: string }) {
    const [isCollapsed, setCollapsed] = useState(true)

    return <form className={`${style.slotForm} ${isCollapsed ? style.collapsed : style.uncollapsed}`} method="post" action="/admin/">
        <span className={style.showForm} onClick={() => { setCollapsed(!isCollapsed) }}>Diese Session verschieben:</span>
        <input type="hidden" name="type" value="move" />
        <input type="hidden" name="fromSlot" value={props.id} />
        <input type="hidden" name="fromRoom" value={props.room} />
        <label>Slot: <input type="number" name="toSlot" defaultValue={props.id} /></label>
        <label>Raum: <select name="toRoom" defaultValue={props.room}>
            {rooms.map((room) => (
                <option key={"r" + room} value={room}>{room}</option>
            ))}
        </select></label>
        <button type="submit">Move/Swap</button>
    </form>
}