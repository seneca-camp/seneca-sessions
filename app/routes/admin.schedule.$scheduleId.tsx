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
import { getSlots } from "~/models/slots";
import { getSchedule } from "~/models/schedule";

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
    <div>
      <h1 className="mb-4 text-2xl font-bold leading-none tracking-tight text-white">
        Edit Mode
      </h1>
      <div>
        {actionData ? (
          <p className="text-deeppurple">{actionData.message}</p>
        ) : (
          ""
        )}
        <form
          className="max-w-md bg-white shadow-md rounded px-8 pt-12 pb-8 mb-4"
          method="post"
          action={`/admin/schedule/${schedule.id}`}
        >
          <input type="hidden" name="scheduleId" value={schedule.id} />
          <div>
            <label className="block text-gray-700 text-md font-bold mb-2">
              Title:{" "}
              <input
                type="text"
                name="title"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                defaultValue={actionData?.message ? actionData.title : ""}
              />
            </label>
          </div>
          <div>
            <label className="block text-gray-700 text-md font-bold mb-2">
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
            <label className="block text-gray-700 text-md font-bold mb-2">
              Room:{" "}
              <select
                id="room"
                name="room"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
          <input type="hidden" name="type" value="create" />
          <div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Add
            </button>
          </div>
        </form>
      </div>
      <div className="overflow-x">
        <table className="w-full text-base text-center text-black table-auto border overflow-scroll">
          <thead className="text-lg text-white uppercase bg-fancyorange">
            <tr key="table-head" className="divide-x">
              <th key="head-1"></th>
              {rooms.map((room) => (
                <th key={room}>{room}</th>
              ))}
            </tr>
          </thead>
          <tbody className="[&>*:nth-child(odd)]:bg-brightpetrole  [&>*:nth-child(even)]:bg-white">
            {slots.map(({ id: slotId, time }) => (
              <tr className="min-h-100 divide-x" key={"row-" + slotId}>
                <td className="text-lg font-bold" key={slotId}>
                  {time}
                </td>
                {rooms.map((room, roomIndex) => {
                  const session = sessions.filter(
                    (s) => s.room === room && s.slot === slotId,
                  )[0];
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
