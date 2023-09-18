import { db } from "~/utils/db.server";
import { redirect } from "@remix-run/node";
import { useActionData } from "react-router";
import { useLoaderData } from "react-router";
import { json } from "@remix-run/node";
import type { ActionFunctionArgs } from "@remix-run/node";
import { rooms } from "~/utils/rooms";
import { slots } from "~/utils/slots";
import { Entry, getCorrectSession, getEntriesForSlot } from "~/utils/sessionsearcher";


async function saveEntry(entry: Entry): boolean {
    const exists = await db.session.count({ where: { slot: entry.slot, room: entry.room } })
    if (exists) {
        return false
    }
    await db.session.create({data: entry})
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
    return {message: message, name: name, slot: slot, room: room};
}

async function deleteEntry(form: FormData) {
    const slot = +form.get("slot");
    const room = form.get("room");

    const entryToDelete = await db.session.findFirst({where: {room: room, slot: slot}, })

    await db.session.delete({where: {id: entryToDelete.id}})
    return {}
}

export const action = async ({
    request,
  }: ActionFunctionArgs) => {
    const form = await request.formData();
    const type = form.get("type");

    if (type === "create"){
        return await create(form)
    }
    else if (type === "delete") {
        return await deleteEntry(form)
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
                    Name: <input type="text" name="name" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue={actionData?.message ? actionData.name : ""}/>
                </label>
                </div>
                <div>
                <label className="block text-gray-700 text-md font-bold mb-2">
                    Slot: <input type="number" name="slot" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue={actionData?.message ? actionData.slot : ""}/>
                </label>
                </div>
                <div>
                <label className="block text-gray-700 text-md font-bold mb-2">
                    Room: <select id="room" name="room" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" defaultValue={actionData?.message ? actionData.room : ""}>
                    {rooms.map((room) => (
                        <option key={"r"+room} value={room}>{room}</option>
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
            {slots.map((slotFull) => (
                <tr className="min-h-100" key={"row"+slotFull.id}>
                    <td className="text-lg font-bold" key={slotFull.id}>{slotFull.time} #{slotFull.id}</td>
                    {getEntriesForSlot(slotFull.id, sessiondata.sessions).map(({name, slot, room}) => (
                        <td key={slotFull.id + name}><p>{name} {(name !== "") ? <form method="post" action="/admin/">
                            <input type="hidden" name="type" value="delete" />
                            <input type="hidden" name="slot" value={slotFull.id} />
                            <input type="hidden" name="room" value={room} />
                            <button type="submit">X</button>
                        </form> : ""}</p></td>
                    ))}
                </tr>
            ))}
        </tbody>
        </table>
    </div>
}