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
    return <div><h1 className="mb-4 text-2xl font-bold leading-none tracking-tight text-grey">Edit Mode</h1>
        <div>
            <form className="max-w-md bg-white shadow-md rounded px-8 pt-12 pb-8 mb-4" method="post" action="/admin/">
                <div>
                <label className="block text-gray-700 text-md font-bold mb-2">
                    Name: <input type="text" name="name" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue={actionData?.fields?.name}/>
                </label>
                </div>
                <div>
                <label className="block text-gray-700 text-md font-bold mb-2">
                    slot: <input type="number" name="slot" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue={actionData?.fields?.slot}/>
                </label>
                </div>
                <div>
                <label className="block text-gray-700 text-md font-bold mb-2">
                    room: <select id="room" name="room" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue={actionData?.fields?.room}>
                    {rooms.map((room) => (
                        <option value={room}>{room}</option>
                    ))}
                    </select>
                </label>
                </div>
                <div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Add
                </button>
                </div>
            </form>
        </div>

        <table className="w-full text-base text-center text-black table-fixed">
        <thead className="text-lg text-white uppercase bg-fancyorange">
            <tr key="table-head">
                <th key="head-1"></th>
                {rooms.map((room) => (
                    <th key={room}>{room}</th>
                ))}
            </tr> 
        </thead>
        <tbody className="[&>*:nth-child(odd)]:bg-brightpetrole [&>*:nth-child(even)]:bg-white">
            {slots.map((slot) => (
                <tr className="min-h-100" key={"row"+slot.id}>
                    <td className="text-lg font-bold" key={slot.id}>{slot.time} #{slot.id}</td>
                    {getEntriesForSlot(slot.id, sessiondata.sessions).map((name) => (
                        <td key={slot.id + name}><p>{name}</p></td>
                    ))}
                </tr>
            ))}
        </tbody>
        </table>
    </div>
}