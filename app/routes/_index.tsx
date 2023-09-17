import { rooms } from "~/utils/rooms";
import { slots } from "~/utils/slots";
import { useLoaderData } from "react-router";
import { json } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { Entry, getCorrectSession, getEntriesForSlot } from "~/utils/sessionsearcher";

export const loader = async () => {
    return json({
      sessions: await db.session.findMany(),
    });
};

export default function IndexRoute() {
    const sessiondata = useLoaderData<typeof loader>();
    return <div>
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
                    <td key={slot.id}>{slot.time}</td>
                    {getEntriesForSlot(slot.id, sessiondata.sessions).map((name) => (
                        <td key={slot.id + name}>{name}</td>
                    ))}
                </tr>
            ))}
        </tbody>
    </table>
    </div>
}