
import { db } from '~/utils/db.server';
import { rooms } from '~/utils/rooms';
import { getEntriesForSlot } from '~/utils/sessionsearcher';
import { slots } from '~/utils/slots';

import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

import styles from './index.module.css';

export const loader = async () => {
    return json({
        sessions: await db.session.findMany(),
    });
};

export default function IndexRoute() {
    const sessiondata = useLoaderData<typeof loader>();
    return <main className={styles.sessionsTableWrapper}>
        <table className={styles.sessionTable}>
            <thead className="text-lg text-white uppercase">
                <tr key="table-head" className="min-width-fit">
                    <th className={styles.roomName} key="head-1" ></th>
                    {rooms.map((room) => (
                        <th className={styles.roomName} key={room}>{room}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {slots.map((slotFull) => (
                    <tr className="min-h-100 min-width-fit" key={"row" + slotFull.id}>
                        <th className={styles.sessionTime} key={slotFull.id}>{slotFull.time}</th>
                        {getEntriesForSlot(slotFull.id, sessiondata?.sessions ?? []).map(({ name, slot, room }) => (
                            <td className={styles.sessionName} key={slotFull.id + name}><p>{name}</p></td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </main>
}