import { useEffect, useState } from 'react';

import { db } from '~/utils/db.server';
import { rooms } from '~/models/rooms';
import { useLoaderData, useRevalidator } from 'react-router';

import styles from '../css/index.module.css';
import { useInterval } from '~/utils/interval-hook';
import { getPublicSchedules } from '~/models/schedule';
import { Schedule } from '@prisma/client';
import { getSlots } from '~/models/slots';
import { Sessions } from '~/components/Sessions';

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

    return (
        <main className={styles.sessionsTableWrapper}>
            {!chosenSchedule && <h1 className="text-white text-center my-8">No sessions :'(</h1>}
            {chosenSchedule && <>
                <div className="flex flex-row justify-center content-center items-center gap-2">
                    {schedules.map((schedule, i) => (
                        <>
                        <button className="text-brightpetrole text-2xl font-cronos" key={schedule.id} onClick={() => setChosenSchedule(schedule)}>
                            {schedule.name}
                        </button>
                        {i !== schedules.length - 1 && <span>-</span>}
                        </>
                    ))}
                </div>
                <Sessions slots={getSlots(chosenSchedule)} sessions={sessions} />
            </>}
        </main>
    );
}


