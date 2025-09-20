import { useEffect, useState } from "react";
import { useLoaderData, useRevalidator, useSearchParams } from "react-router";

import { useInterval } from "~/utils/interval-hook";
import { getPublicSchedules, PublicSchedule } from "~/models/schedule";
import { getSlots } from "~/models/slots";
import { Sessions, SessionView } from "~/components/Sessions";
import Button from "~/components/ui/Button";
import { LikeButton } from "~/components/LikeButton";
import { getRoomNames } from "~/models/rooms";

export const loader = async () => {
  const schedules = await getPublicSchedules();
  const rooms = await getRoomNames();
  return { schedules, rooms };
};

export default function IndexRoute() {
  if (typeof document !== "undefined") {
    const revalidator = useRevalidator();
    const [shouldRevalidate, setShouldRevalidate] = useState(true);
    useEffect(
      () =>
        window.addEventListener("focus", () => {
          setShouldRevalidate(true);
          revalidator.revalidate();
        }),
      [],
    );
    useEffect(
      () => window.addEventListener("blur", () => setShouldRevalidate(false)),
      [],
    );
    useInterval(revalidator.revalidate, shouldRevalidate ? 5000 : null);
  }

  const { schedules, rooms } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState<SessionView>(
    (searchParams.get("view") as SessionView) || "table",
  );
  const [onlyLiked, setOnlyLiked] = useState<boolean>(
    searchParams.get("onlyLiked") === "true",
  );

  const defaultSchedule =
    schedules.find(
      (schedule) => schedule.id === searchParams.get("schedule"),
    ) || schedules[schedules.length - 1];
  const [chosenSchedule, setChosenSchedule] =
    useState<PublicSchedule>(defaultSchedule);

  const toggleOnlyLiked = () => {
    const newState = !onlyLiked;
    setOnlyLiked(newState);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("onlyLiked", newState.toString());
    setSearchParams(newSearchParams);
  };

  return (
    <>
      {!chosenSchedule && (
        <h1 className="text-white text-center my-8">No sessions :'(</h1>
      )}
      {chosenSchedule && (
        <>
          <div className="sticky top-0 z-20 mx-auto flex flex-row md:justify-center justify-between content-center bg-gray items-center gap-2 py-6">
            <Button
              size="icon"
              variant="outline"
              color="primary"
              aria-label={
                view === "table"
                  ? "Switch to list view"
                  : "Switch to table view"
              }
              onClick={() => {
                const newView = view === "table" ? "list" : "table";
                setView(newView);
                const newSearchParams = new URLSearchParams(searchParams);
                newSearchParams.set("view", newView);
                setSearchParams(newSearchParams);
              }}
            >
              {view === "table" ? (
                <i className="ri-list-check text-xl"></i>
              ) : (
                <i className="ri-table-2 text-xl"></i>
              )}
            </Button>
            {schedules.map((schedule) => (
              <Button
                variant={
                  chosenSchedule.id === schedule.id ? "solid" : "outline"
                }
                color="primary"
                size="md"
                onClick={() => {
                  setChosenSchedule(schedule);
                  const newSearchParams = new URLSearchParams(searchParams);
                  newSearchParams.set("schedule", schedule.id);
                  setSearchParams(newSearchParams);
                }}
                className="font-cronos"
              >
                {schedule.name}
              </Button>
            ))}
            <LikeButton
              color={onlyLiked ? "danger" : "primary"}
              liked={onlyLiked}
              onClick={toggleOnlyLiked}
              variant={onlyLiked ? "solid" : "outline"}
            />
          </div>
          <Sessions
            slots={getSlots(chosenSchedule)}
            sessions={chosenSchedule.sessions}
            view={view}
            onlyLiked={onlyLiked}
            rooms={rooms}
          />
        </>
      )}
    </>
  );
}
