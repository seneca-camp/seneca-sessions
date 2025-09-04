import { useEffect, useMemo, useState } from 'react';

import { db } from '~/utils/db.server';
import { rooms } from '~/models/rooms';
import { useLoaderData, useRevalidator } from 'react-router';

import styles from '../css/index.module.css';
import { useInterval } from '~/utils/interval-hook';
import { SessionTable } from '~/components/SessionTable';
import { getPublicSchedules } from '~/models/schedule';
import { Schedule } from '@prisma/client';
import { getSlots } from '~/models/slots';

export const loader = async () => {
    const sessions = await db.session.findMany();
    const schedules = await getPublicSchedules();
    return { sessions, schedules };
};

export default function IndexRoute() {
    if (typeof document !== "undefined") {
        const revalidator = useRevalidator();
        const [shouldRevalidate, setShouldRevalidate] = useState(true)
        useEffect(() => window.addEventListener("focus", () => {
            setShouldRevalidate(true);
            revalidator.revalidate();
        }), [])
        useEffect(() => window.addEventListener("blur", () => setShouldRevalidate(false)), [])
        useInterval(revalidator.revalidate, shouldRevalidate ? 5000 : null);
    }

    const { sessions, schedules } = useLoaderData<typeof loader>();
    const [chosenSchedule, setChosenSchedule] = useState<Schedule>(schedules[schedules.length - 1]);

    return <main className={styles.sessionsTableWrapper}>
        {!chosenSchedule && <h1>No schedules available</h1>}
        {chosenSchedule && <>
            <div className="flex flex-row justify-center items-center gap-2">
                {schedules.map((schedule) => (
                    <button className={styles.scheduleTitle} key={schedule.id} onClick={() => setChosenSchedule(schedule)}>
                        {schedule.name}
                    </button>
                ))}
            </div>
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
                    <SessionTable slots={getSlots(chosenSchedule)} sessions={sessions} />
                </tbody>
            </table>
        </>}
    </main>
}


