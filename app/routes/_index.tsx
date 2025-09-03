import { useEffect, useMemo, useState } from 'react';

import { db } from '~/utils/db.server';
import { rooms } from '~/models/rooms';
import { getDay, Day } from '~/models/slots';

import { useRevalidator } from 'react-router';

import styles from '../css/index.module.css';
import { useInterval } from '~/utils/interval-hook';
import { SessionTable } from '~/components/SessionTable';

export const loader = async () => {
    const sessions = await db.session.findMany();
    return sessions;
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

    const [dayChecked, setDayChecked] = useState<boolean>(true);

    function otherDay(currentDay: Day): Day {
        return currentDay === "SATURDAY" ? "SUNDAY" : "SATURDAY";
    }

    const chosenDay = useMemo<Day>(() => dayChecked ? getDay() : otherDay(getDay()), [dayChecked]);

    return <main className={styles.sessionsTableWrapper}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <label className="inline-flex items-center cursor-pointer">
                <span className="ms-3 m-4 text-sm font-medium text-gray-900 dark:text-gray-300">{otherDay(getDay())}</span>
                <input type="checkbox" value="" className="sr-only peer m-6" checked={dayChecked} onChange={() => setDayChecked(!dayChecked)}/>
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">{getDay()} (TODAY!)</span>
            </label>
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
                <SessionTable day={chosenDay}/>
            </tbody>
        </table>
    </main>
}


