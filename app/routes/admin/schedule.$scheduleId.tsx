import { useEffect, useState } from "react";
import { useInterval } from "~/utils/interval-hook";

import { rooms } from "~/models/rooms";
import {
  createSession,
  deleteSession,
  getSessions as getAllSessions,
  moveSession,
  renameSession,
  switchSessions,
} from "~/models/sessions";
import {
  ActionFunctionArgs,
  useActionData,
  useLoaderData,
  useRevalidator,
} from "react-router";
import { SessionSlot } from "~/components/SessionSlot";
import { EmptySessionSlot } from "~/components/EmptySessionSlot";
import { getSlots, Slot } from "~/models/slots";
import { getSchedule } from "~/models/schedule";
import { Schedule } from "@prisma/client";
import { Button } from "~/components/ui/Button";

export const action = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const type = form.get("type");

  if (type === "create") {
    return await createSession(form);
  } else if (type === "delete") {
    return await deleteSession(form);
  } else if (type === "move") {
    return await moveSession(form);
  } else if (type === "switch") {
    return await switchSessions(form);
  } else if (type === "rename") {
    return await renameSession(form);
  }
};

export const loader = async ({ params }: { params: { scheduleId: string } }) => {
  const sessions = await getAllSessions(params.scheduleId);
  const schedule = await getSchedule(params.scheduleId);
  return { sessions, schedule };
};

export default function ScheduleRoute() {
  const actionData = useActionData();
  const { sessions, schedule } = useLoaderData<typeof loader>();
  const slots = getSlots(schedule);

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
    useInterval(revalidator.revalidate, shouldRevalidate ? 1000 : null);
  }

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold leading-none tracking-tight text-white">
        Add Session
      </h1>
      <AddSessionForm schedule={schedule} actionData={actionData} slots={slots} />
      <div className="overflow-x">
        <table className="border-separate border-spacing-2 w-full">
          <thead className="text-lg text-white uppercase">
            <tr key="table-head" className="min-width-fit">
              <th className="text-left" key="head-1" ></th>
              {rooms.map((room) => (
                <th className="text-white p-2" key={room}>{room}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slots.map(({ id: slotId, time }) => (
              <tr className="min-h-100 min-width-fit px-4" key={"row" + slotId}>
                <th className="text-xl text-white text-left p-4">{time}</th>
                {rooms.map((room, roomIndex) => {
                  const session = sessions.filter(s => s.room === room && s.slot === slotId)[0];
                  if (!session) {
                    return <EmptySessionSlot key={`slot-${slotId}-room-${roomIndex}`} slotId={slotId} room={room} />;
                  }
                  return <SessionSlot key={session.id} session={session} />;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AddSessionForm({ schedule, actionData, slots }: { schedule: Schedule, actionData: any, slots: Slot[] }) {
  return (
    <form
      className="max-w-lg bg-gray-90 font-bold text-white text-md shadow-md rounded-lg px-8 pt-12 pb-8 mb-4"
      method="post"
      action={`/admin/schedule/${schedule.id}`}
    >
      <input type="hidden" name="scheduleId" value={schedule.id} />
      <div>
        <label className="block font-bold mb-2">
          Title:{" "}
          <input
            required
            type="text"
            name="title"
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            defaultValue={actionData?.message ? actionData.title : ""}
          />
        </label>
      </div>
      <div>
        <label className="block bold mb-2">
          Slot:
          <select
            name="slot"
            defaultValue={actionData?.message ? actionData.slot : ""}
          >
            {slots.map((slot) => (
              <option key={slot.id} value={slot.id}>
                {slot.time}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label className="block mb-2">
          Room:{" "}
          <select
            id="room"
            name="room"
            className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
            defaultValue={actionData?.message ? actionData.room : ""}
          >
            {rooms.map((room) => (
              <option key={"r" + room} value={room}>
                {room}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="h-8">
        {actionData?.message && <p className="text-deeppurple p-2 rounded-md bg-deeppurple-10 border-1 border-deeppurple">{actionData.message}</p>}
      </div>
      <input type="hidden" name="type" value="create" />
      <Button className="mt-4" variant="solid" color="primary" type="submit">Add</Button>
    </form>
  )
}
