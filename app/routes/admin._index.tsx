import { useEffect, useState } from 'react';
import { useActionData, useLoaderData, useRevalidator } from 'react-router';
import type { ActionFunctionArgs } from 'react-router';
import { useInterval } from '~/utils/interval-hook';

import style from '../css/admin.index.module.css';
import { rooms } from '~/models/rooms';
import { getSessionsForSlot } from '~/utils/sessionsearcher';
import { Slot, slots } from '~/models/slots';
import { createSession, deleteSession, getSessions as getAllSessions, moveSession, renameSession } from '~/models/sessions';

export const action = async ({
    request,
}: ActionFunctionArgs) => {
    const form = await request.formData();
    const type = form.get("type");

    if (type === "create") {
        return await createSession(form)
    }
    else if (type === "delete") {
        return await deleteSession(form)
    }
    else if (type === "move") {
        return await moveSession(form)
    }
    else if (type === "rename") {
        return await renameSession(form)
    }
};

export const loader = async () => {
    const sessions = await getAllSessions();
    return sessions;
};


export default function IndexRoute() {
    const actionData = useActionData<typeof action>();
    const sessions = useLoaderData<typeof loader>();


    if (typeof document !== "undefined") {
        const revalidator = useRevalidator();
        const [shouldRevalidate, setShouldRevalidate] = useState(true)
        useEffect(() => window.addEventListener("focus", () => {
            setShouldRevalidate(true);
            revalidator.revalidate();
        }), [])
        useEffect(() => window.addEventListener("blur", () => setShouldRevalidate(false)), [])
        useInterval(revalidator.revalidate, shouldRevalidate ? 1000 : null);
    }


    return <div><h1 className="mb-4 text-2xl font-bold leading-none tracking-tight text-grey">Edit Mode</h1>
        <div>
            {actionData ? <p className="text-deeppurple">{actionData.message}</p> : ""}
            <form className="max-w-md bg-white shadow-md rounded px-8 pt-12 pb-8 mb-4" method="post" action="/admin/">
                <div>
                    <label className="block text-gray-700 text-md font-bold mb-2">
                        Title: <input type="text" name="title" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue={actionData?.message ? actionData.title : ""} />
                    </label>
                </div>
                <div>
                    <label className="block text-gray-700 text-md font-bold mb-2">
                        Slot:
                        <select name="slot" defaultValue={actionData?.message ? actionData.slot : ""}>
                            {slots.map((slot) => (
                                <option key={slot.id} value={slot.id}>{slot.time}</option>
                            ))}
                        </select>
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
                    {slots.map(({ id: slotId, time }) => (
                        <tr className="min-h-100 divide-x" key={"row-" + slotId}>
                            <td className="text-lg font-bold">{time}</td>
                            {rooms.map((room, roomIndex) => {
                                const session = sessions.filter(s => s.room === room && s.slot === slotId)[0];
                                if (!session) {
                                    return <td key={`slot-${slotId}-room-${roomIndex}`}></td>;
                                }
                                return <td key={session.id}>
                                    <p>{session.title}</p>
                                    <DeleteForm id={slotId} room={room} />
                                    <MoveForm id={slotId} room={room} allSlots={slots} />
                                    <RenameForm id={slotId} room={room} title={session.title} />
                                </td>
                            })}
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
        <span className={style.showForm} onClick={() => setCollapsed(!isCollapsed)}>Session löschen:</span>
        <input type="hidden" name="type" value="delete" />
        <input type="hidden" name="slot" value={props.id} />
        <input type="hidden" name="room" value={props.room} />
        <button type="submit">Eintrag löschen</button>
    </form>
}

function MoveForm(props: { allSlots: Slot[], id: number, room: string }) {
    const [isCollapsed, setCollapsed] = useState(true)

    return <form className={`${style.slotForm} ${isCollapsed ? style.collapsed : style.uncollapsed}`} method="post" action="/admin/">
        <span className={style.showForm} onClick={() => { setCollapsed(!isCollapsed) }}>Session verschieben:</span>
        <input type="hidden" name="type" value="move" />
        <input type="hidden" name="fromSlot" value={props.id} />
        <input type="hidden" name="fromRoom" value={props.room} />
        <label>Slot: <select name="toSlot" defaultValue={props.id}>
            {slots.map((slot) => (
                <option key={slot.id} value={slot.id}>{slot.time}</option>
            ))}
        </select></label>
        <label>Raum: <select name="toRoom" defaultValue={props.room}>
            {rooms.map((room) => (
                <option key={"r" + room} value={room}>{room}</option>
            ))}
        </select></label>
        <button type="submit">Move/Swap</button>
    </form>
}

function RenameForm(props: { id: number, room: string, title: string }) {
    const [isCollapsed, setCollapsed] = useState(true)

    return <form className={`${style.slotForm} ${isCollapsed ? style.collapsed : style.uncollapsed}`} method="post" action="/admin/">
        <span className={style.showForm} onClick={() => { setCollapsed(!isCollapsed) }}>Session umbenennen:</span>
        <input type="hidden" name="type" value="rename" />
        <input type="hidden" name="slot" value={props.id} />
        <input type="hidden" name="room" value={props.room} />
        <input type="text" name="title" defaultValue={props.title} />

        <button type="submit">Umbenennen</button>
    </form>
}