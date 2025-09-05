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
        <ul className="space-y-6">
            {props.slots.map((slot) => (
                <li key={slot.id} className="bg-white/80 rounded-lg shadow p-4">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded">{slot.time}</span>
                    </h2>
                    <div className="space-y-3">
                        {props.sessions.filter(s => s.slot === slot.id).map((session) => (
                            <div key={session.id} className={`flex items-center justify-between p-3 rounded transition-colors border ${session.liked ? 'bg-red-100 border-red-300' : 'bg-gray-50 border-gray-200'}`}>
                                <div>
                                    <p className="font-medium text-gray-900">{session.title}</p>
                                    <p className="text-sm text-gray-500">{session.room}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <a href={session.note} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 gap-1">
                                        <i className="ri-file-text-line"></i>
                                    </a>
                                    <button
                                        onClick={() => props.toggleLikedness(session.id)}
                                        className={`text-2xl focus:outline-none transition-colors ${session.liked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
                                        title={session.liked ? "Unlike" : "Like"}
                                    >
                                        <i className={session.liked ? "ri-heart-fill" : "ri-heart-line"}></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                        {props.sessions.filter(s => s.slot === slot.id).length === 0 && (
                            <div className="text-gray-400 italic">No sessions in this slot.</div>
                        )}
                    </div>
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
