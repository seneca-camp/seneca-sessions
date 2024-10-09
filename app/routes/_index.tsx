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
    const sessions = await db.session.findMany();
    return json(sessions);
};

export default function IndexRoute() {
    const sessions = useLoaderData<typeof loader>();

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
                {slots.map(({ id: slotId, time }) => (
                    <tr className="min-h-100 min-width-fit" key={"row" + slotId}>
                        <th className={styles.sessionTime}>{time}</th>
                        {rooms.map((room, roomIndex) => {
                            const session = sessions.filter(s => s.room === room && s.slot === slotId)[0];
                            if (!session) {
                                return <td key={`slot-${slotId}-room-${roomIndex}`} className={styles.sessionName}></td>;
                            }
                            return <td
                                onClick={() => toggleLikedness(session.id)}
                                className={`${styles.sessionName} ${styles.hasContent} ${isLiked(session.id) ? styles.likedSession : ""}`}
                                key={session.id}
                                data-sessionid={session.id}
                            >
                                <p>{session.title}</p>
                            </td>
                        })}
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