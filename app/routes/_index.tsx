
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useHydrated } from 'remix-utils/use-hydrated';
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

    const [likedSessionIds, setLikedSessionIds] = usePersistedState<number[]>([], "liked-session-ids")

    const isHydrated = useHydrated(); // oh god this is so hacky
    const isLiked = (id: number | undefined) => isHydrated && likedSessionIds.includes(id ?? -1)

    const toggleLikedness = (id: number | undefined, name: string) => {
        if (id === undefined || name === "") { // wtf? why can there be an id with name as emptystring randomly?
            return;
        }

        if (isLiked(id)) {
            setLikedSessionIds(likedSessionIds.filter((value) => value !== id));
        } else {
            setLikedSessionIds([...likedSessionIds, id])
        }
        return;
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
                        {getEntriesForSlot(slotFull.id, sessiondata.sessions).map(({ id, name, slot, room }) => (
                            <td
                                onClick={() => { toggleLikedness(id, name); }}
                                className={`${styles.sessionName} ${isLiked(id) ? styles.likedSession : ""} ${id !== undefined && name !== "" ? styles.hasContent : ''}`}
                                key={slotFull.id + room}
                                data-sessionid={id}
                            >
                                <p>{name}</p>
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