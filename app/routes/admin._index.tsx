import { db } from "~/utils/db.server";
import { redirect } from "@remix-run/node";
import { useActionData } from "react-router";
import { useLoaderData } from "react-router";
import { json } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { rooms } from "~/utils/rooms";
import { slots } from "~/utils/slots";
import { Entry, getCorrectSession, getEntriesForSlot } from "~/utils/sessionsearcher";


async function saveEntry(entry: Entry) {
    await db.session.create({data: entry})
}

export const action = async ({
    request,
  }: ActionFunctionArgs) => {
    const form = await request.formData();
    const name = form.get("name");
    const slot = +form.get("slot");
    const room = form.get("room");
    const entry = { slot, name, room };
    
    saveEntry(entry);

    return redirect(`/admin`);
};

export const loader = async () => {
    return json({
      sessions: await db.session.findMany(),
    });
};


export default function IndexRoute() {
    const actionData = useActionData<typeof action>();
    const sessiondata = useLoaderData<typeof loader>();
    return <div><h2>Edit Mode</h2>
        <div>
            <form method="post" action="/admin/">
                <div>
                <label>
                    Name: <input type="text" name="name" defaultValue={actionData?.fields?.name}/>
                </label>
                </div>
                <div>
                <label>
                    slot: <input type="number" name="slot" defaultValue={actionData?.fields?.slot}/>
                </label>
                </div>
                <div>
                <label>
                    room: <select id="room" name="room" defaultValue={actionData?.fields?.room}>
                    {rooms.map((room) => (
                        <option value={room}>{room}</option>
                    ))}
                    </select>
                </label>
                </div>
                <div>
                <button type="submit" className="button">
                    Add
                </button>
                </div>
            </form>
        </div>

        <table>
        <thead>
            <tr key="table-head">
                <th key="head-1"></th>
                {rooms.map((room) => (
                    <th key={room}>{room}</th>
                ))}
            </tr> 
        </thead>
        <tbody>
            {slots.map((slot) => (
                <tr key={"row"+slot.id}>
                    <td key={slot.id}>{slot.time} (#{slot.id})</td>
                    {getEntriesForSlot(slot.id, sessiondata.sessions).map((name) => (
                        <td key={slot.id + name}>{name}</td>
                    ))}
                </tr>
            ))}
        </tbody>
    </table>
    </div>
}