import { useHydrated } from 'remix-utils/use-hydrated';
import { Slot } from '~/models/slots';
import styles from '../css/index.module.css';
import { rooms } from '~/models/rooms';
import { Session } from '@prisma/client';
import { usePersistedState } from '~/hooks/persistedState';
import { useState } from 'react';

export type UserSession = Session & {
    liked: boolean;
}

export type SessionsViewProps = {
    slots: Slot[];
    sessions: UserSession[];
    toggleLikedness: (sessionId: string) => void;
}

type SessionView = 'table' | 'list';

export function Sessions(props: { slots: Slot[], sessions: Session[] }) {
    const [view, setView] = useState<SessionView>('table');
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

    const userSessions = props.sessions.map((session) => ({
        ...session,
        liked: isLiked(session.id)
    }));

    return (
        <div>
            <div className="flex flex-row gap-2 mb-4">
                {view === 'table' && <button onClick={() => setView('list')} className="cursor-pointer">
                    <i className="ri-table-2 text-2xl bg-white rounded-full p-1"></i>
                </button>}
                {view === 'list' && <button onClick={() => setView('table')} className="cursor-pointer">
                    <i className="ri-list-check text-2xl bg-white rounded-full p-1"></i>
                </button>}
            </div>
            {view === 'table' && <SessionTable slots={props.slots} sessions={userSessions} toggleLikedness={toggleLikedness} />}
            {view === 'list' && <SessionList slots={props.slots} sessions={userSessions} toggleLikedness={toggleLikedness} />}
        </div>
    )
}

function SessionList(props: SessionsViewProps) {
    return (
        <ul>
            {props.slots.map((slot) => (
                <li key={slot.id}>
                    <h2>{slot.time}</h2>
                    {props.sessions.filter(s => s.slot === slot.id).map((session) => (
                        <div key={session.id}>{session.title}</div>
                    ))}
                </li>
            ))}
        </ul>
    );
}

function SessionTable(props: SessionsViewProps) {
    return (
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
                {props.slots.map(({ id: slotId, time }) => (
                    <tr className="min-h-100 min-width-fit" key={"row" + slotId}>
                        <th className={styles.sessionTime}>{time}</th>
                        {rooms.map((room, roomIndex) => {
                            const session = props.sessions.filter(s => s.room === room && s.slot === slotId)[0];
                            if (!session) {
                                return <td key={`slot-${slotId}-room-${roomIndex}`} className={styles.sessionName}></td>;
                            }
                            return <td
                                className={`${styles.sessionName} ${styles.hasContent} ${session.liked ? styles.likedSession : ""}`}
                                key={session.id}
                                data-sessionid={session.id}
                            >
                                <div onClick={() => props.toggleLikedness(session.id)}>
                                    <p>{session.title}</p>
                                </div>
                                <hr />
                                <a href={session.note} target="_blank"><div className={`text-center`}>Session Notes - 📝</div></a>
                            </td>
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
