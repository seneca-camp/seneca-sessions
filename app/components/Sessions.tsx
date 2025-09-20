import { useHydrated } from "remix-utils/use-hydrated";
import { Slot } from "~/models/slots";
import { Session } from "@prisma/client";
import { usePersistedState } from "~/hooks/persistedState";
import { SessionTable } from "./SessionTable";
import { SessionList } from "./SessionList";

export type UserSession = Session & {
  liked: boolean;
};

export type SessionsViewProps = {
  slots: Slot[];
  sessions: UserSession[];
  toggleLikedness: (sessionId: string) => void;
  rooms: string[];
};

export type SessionView = "table" | "list";

export function Sessions(props: {
  slots: Slot[];
  sessions: Session[];
  view: SessionView;
  onlyLiked: boolean;
  rooms: string[];
}) {
  const isHydrated = useHydrated();
  const [likedSessionIds, setLikedSessionIds] = usePersistedState<string[]>(
    [],
    "liked-session-ids",
  );
  const isLiked = (sessionId: string) =>
    isHydrated && likedSessionIds.includes(sessionId);

  const toggleLikedness = (sessionId: string) => {
    if (isLiked(sessionId)) {
      setLikedSessionIds(
        likedSessionIds.filter((value) => value !== sessionId),
      );
    } else {
      setLikedSessionIds([...likedSessionIds, sessionId]);
    }
  };

  const userSessions = props.sessions
    .map((session) => ({
      ...session,
      liked: isLiked(session.id),
    }))
    .filter((session) => (props.onlyLiked ? session.liked : true));

  return (
    <div className="overflow-x-auto">
      {props.view === "table" && (
        <SessionTable
          slots={props.slots}
          sessions={userSessions}
          toggleLikedness={toggleLikedness}
          rooms={props.rooms}
        />
      )}
      {props.view === "list" && (
        <SessionList
          slots={props.slots}
          sessions={userSessions}
          toggleLikedness={toggleLikedness}
          rooms={props.rooms}
        />
      )}
    </div>
  );
}
