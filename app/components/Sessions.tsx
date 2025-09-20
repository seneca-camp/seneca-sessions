import { Session } from "@prisma/client";
import { useEffect } from "react";
import { useRevalidator } from "react-router";
import { useHydrated } from "remix-utils/use-hydrated";
import { usePersistedState } from "~/hooks/persistedState";
import { Slot } from "~/models/slots";
import { getRandomUserId } from "~/utils/user-id";
import { SessionList } from "./SessionList";
import { SessionTable } from "./SessionTable";

export type UserSession = Session & {
  liked: boolean;
  likeCount?: number;
};

export type SessionsViewProps = {
  slots: Slot[];
  sessions: UserSession[];
  toggleLikedness: (sessionId: string) => void;
  rooms: string[];
};

export type SessionView = "table" | "list";

export function Sessions(props: {
  scheduleId: string;
  slots: Slot[];
  sessions: Session[];
  view: SessionView;
  onlyLiked: boolean;
  rooms: string[];
  likeCountBySessionId: Map<string, number>;
}) {
  const isHydrated = useHydrated();
  const revalidator = useRevalidator();
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
      likeCount: props.likeCountBySessionId.get(session.id) ?? 0,
    }))
    .filter((session) => (props.onlyLiked ? session.liked : true));

  useEffect(() => {
    if (!isHydrated) return;
    const userId = getRandomUserId();
    const controller = new AbortController();
    fetch("/api/likes/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        scheduleId: props.scheduleId,
        likedSessionIds,
      }),
      signal: controller.signal,
      keepalive: true,
    })
      .catch(() => {})
      .then(() => {
        revalidator.revalidate();
      });
    return () => controller.abort();
  }, [isHydrated, likedSessionIds]);

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
