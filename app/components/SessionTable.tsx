import { useHydrated } from 'remix-utils/use-hydrated';
import { slots, Day } from '~/models/slots';
import { useLoaderData } from 'react-router';
import styles from '../css/index.module.css';
import { loader } from '~/routes/_index';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { rooms } from '~/models/rooms';


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

export function SessionTable(props: {day: Day}) {
    const day = props.day;
    const sessions = useLoaderData<typeof loader>();
    const isHydrated = useHydrated(); // oh god this is so hacky
    const [likedSessionIds, setLikedSessionIds] = usePersistedState<string[]>([], "liked-session-ids");
    const isLiked = (sessionId: string) => isHydrated && likedSessionIds.includes(sessionId);
    const toggleLikedness = (sessionId: string) => {
        if (isLiked(sessionId)) {
            setLikedSessionIds(likedSessionIds.filter((value) => value !== sessionId));
        } else {
            setLikedSessionIds([...likedSessionIds, sessionId])
        }
    }

    return slots[day].map(({ id: slotId, time }) => (
        <tr className="min-h-100 min-width-fit" key={"row" + slotId}>
            <th className={styles.sessionTime}>{time}</th>
            {rooms.map((room, roomIndex) => {
                const session = sessions.filter(s => s.room === room && s.slot === slotId && s.day === day)[0];
                if (!session) {
                    return <td key={`slot-${slotId}-room-${roomIndex}`} className={styles.sessionName}></td>;
                }
                return <td
                    className={`${styles.sessionName} ${styles.hasContent} ${isLiked(session.id) ? styles.likedSession : ""}`}
                    key={session.id}
                    data-sessionid={session.id}
                >
                    <div
                        onClick={() => toggleLikedness(session.id)}
                    >
                        <p>{session.title}</p>
                    </div>
                    <hr />
                    <a href={session.note} target="_blank"><div className={`text-center`}>Session Notes - 📝</div></a>
                </td>
            })}
        </tr>
    ))
}
