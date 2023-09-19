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
    return <>
        <table className="w-full text-base text-center text-black table-fixed">
        <thead className="text-lg text-white uppercase bg-fancyorange">
            <tr key="table-head">
                <th key="head-1"></th>
                {rooms.map((room) => (
                    <th key={room}>{room}</th>
                ))}
            </tr> 
        </thead>
        <tbody className="[&>*:nth-child(odd)]:bg-brightpetrole [&>*:nth-child(odd)]:text-white [&>*:nth-child(even)]:bg-white">
            {slots.map((slotFull) => (
                <tr className="min-h-100" key={"row"+slotFull.id}>
                    <td className="text-lg font-bold" key={slotFull.id}>{slotFull.time}</td>
                    {getEntriesForSlot(slotFull.id, sessiondata.sessions).map(({name, slot, room}) => (
                        <td key={slotFull.id + name}><p>{name}</p></td>
                    ))}
                </tr>
            ))}
        </tbody>
        </table>
    </>
}