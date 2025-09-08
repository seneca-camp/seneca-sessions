import { useHydrated } from 'remix-utils/use-hydrated';
import { Slot } from '~/models/slots';
import { Session } from '@prisma/client';
import { usePersistedState } from '~/hooks/persistedState';
import Button from '~/components/ui/Button';
import { SessionTable } from './SessionTable';
import { SessionList } from './SessionList';

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
                    color="primary"
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
