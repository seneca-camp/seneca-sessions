import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useHydrated } from 'remix-utils/use-hydrated';
import { db } from '~/utils/db.server';
import { rooms } from '~/models/rooms';
import { slots } from '~/models/slots';
import { getSessionsForSlot } from '~/utils/sessionsearcher';

import { json } from '@remix-run/node';
import { useLoaderData, useRevalidator } from '@remix-run/react';

import styles from './index.module.css';
import { useInterval } from '~/utils/interval-hook';

export const loader = async () => {
    return json({
        sessions: await db.session.findMany(),
    });
};

export default function IndexRoute() {
    const sessiondata = useLoaderData<typeof loader>();

    const [likedSessionIds, setLikedSessionIds] = usePersistedState<number[]>([], "liked-session-ids")

    const isHydrated = useHydrated(); // oh god this is so hacky
    const isLiked = (id: number | undefined) => isHydrated && likedSessionIds.includes(id ?? -1)

    const toggleLikedness = (id: number | undefined, title: string) => {
        if (id === undefined || title === "") { // wtf? why can there be an id with name as emptystring randomly?
            return;
        }

        if (isLiked(id)) {
            setLikedSessionIds(likedSessionIds.filter((value) => value !== id));
        } else {
            setLikedSessionIds([...likedSessionIds, id])
        }
        return;
    }

    if(typeof document !== "undefined") {
        const revalidator = useRevalidator();
        const [shouldRevalidate, setShouldRevalidate] = useState(true)
        useEffect(() => window.addEventListener("focus", () => {
            setShouldRevalidate(true);
            revalidator.revalidate();
        }), [])
        useEffect(() => window.addEventListener("blur", () => setShouldRevalidate(false)), [])
        useInterval(revalidator.revalidate, shouldRevalidate ? 5000 : null);
    }

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
                        {getSessionsForSlot(slotFull.id, sessiondata.sessions).map(({ id, title, slot, room }) => (
                            <td
                                onClick={() => { toggleLikedness(id, title); }}
                                className={`${styles.sessionName} ${isLiked(id) ? styles.likedSession : ""} ${id !== undefined && title !== "" ? styles.hasContent : ''}`}
                                key={slotFull.id + room}
                                data-sessionid={id}
                            >
                                <p>{title}</p>
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    </main>
}


type PersistedState<T> = [T, Dispatch<SetStateAction<T>>];

function usePersistedState<T>(defaultValue: T, key: string): PersistedState<T> {
    if (typeof document === "undefined") { // todo: proper frontend-only code, but no time to figure this out now
        return [defaultValue, () => { }];
    }

    const [value, setValue] = useState<T>(() => {
        const value = window.localStorage.getItem(key);

        return value ? (JSON.parse(value) as T) : defaultValue;
    });

    useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, (...args) => { console.log("setting"); setValue(...args) }];
}