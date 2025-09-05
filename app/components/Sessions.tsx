import { useHydrated } from 'remix-utils/use-hydrated';
import { Slot } from '~/models/slots';
import styles from '../css/index.module.css';
import ui from '../css/ui.module.css';
import { rooms } from '~/models/rooms';
import { Session } from '@prisma/client';
import { usePersistedState } from '~/hooks/persistedState';
import Button from '~/components/ui/Button';

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
    const [view, setView] = usePersistedState<SessionView>('table', 'session-view');
    const isHydrated = useHydrated();
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
            <div className="flex flex-row gap-2 mb-4 justify-end">
                <Button
                    size="icon"
                    variant="outline"
                    tone="primary"
                    aria-label={view === 'table' ? "Switch to list view" : "Switch to table view"}
                    onClick={() => setView(view === 'table' ? 'list' : 'table')}
                >
                    {view === 'table' ? (
                        <i className="ri-list-check text-xl"></i>
                    ) : (
                        <i className="ri-table-2 text-xl"></i>
                    )}
                </Button>
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
                <li key={slot.id} className={`${ui.cardLight} p-4`}>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="flex items-center gap-3">
                            <span className={`${ui.badge} ${ui.badgeBrand}`}>{slot.time}</span>
                        </h2>
                    </div>
                    <div className="space-y-3">
                        {props.sessions.filter(s => s.slot === slot.id).map((session) => (
                            <div key={session.id} className={`flex items-center justify-between p-3 rounded border transition-colors ${session.liked ? 'bg-deeppurple-10 border-deeppurple-40' : 'bg-fancyorange-10 border-fancyorange-40 hover:bg-fancyorange-20'}`} >
                                <div>
                                    <p className="font-medium text-gray-900">{session.title}</p>
                                    <p className={`text-gray-600 text-sm`}>{session.room}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {session.note && (
                                        <a href={session.note} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800 p-2" title="Open session notes">
                                            <i className="ri-file-text-line text-lg"></i>
                                        </a>
                                    )}
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        tone={session.liked ? 'danger' : 'accent'}
                                        aria-label={session.liked ? 'Unlike' : 'Like'}
                                        onClick={() => props.toggleLikedness(session.id)}
                                    >
                                        <i className={session.liked ? 'ri-heart-fill text-xl' : 'ri-heart-line text-xl'}></i>
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {props.sessions.filter(s => s.slot === slot.id).length === 0 && (
                            <div className={`${ui.muted} italic`}>No sessions in this slot.</div>
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
                            return (
                                <td className={`${styles.sessionName} ${styles.hasContent} ${session.liked ? styles.likedSession : ""}`}
                                    key={session.id}
                                    data-sessionid={session.id}>
                                    <div onClick={() => props.toggleLikedness(session.id)}>
                                        <p>{session.title}</p>
                                    </div>
                                    <hr />
                                    <a href={session.note} target="_blank"><div className={`text-center`}>Session Notes - 📝</div></a>
                                </td>
                            )
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
