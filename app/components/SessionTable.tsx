import { SessionsViewProps } from "./Sessions";
import { rooms } from "../models/rooms";
import { SessionItem } from "./SessionItem";

export function SessionTable(props: SessionsViewProps) {
  return (
    <table className="border-separate border-spacing-2 w-full">
      <thead className="text-lg text-white uppercase">
        <tr key="table-head" className="min-width-fit">
          <th className="text-left" key="head-1"></th>
          {rooms.map((room) => (
            <th className="text-white p-2" key={room}>
              {room}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.slots.map(({ id: slotId, time }) => (
          <tr className="min-h-100 min-width-fit px-4" key={"row" + slotId}>
            <th className="text-xl text-white text-left p-4">{time}</th>
            {rooms.map((room, roomIndex) => {
              const session = props.sessions.filter(
                (s) => s.room === room && s.slot === slotId,
              )[0];
              if (!session) {
                return (
                  <td
                    key={`slot-${slotId}-room-${roomIndex}`}
                    className="bg-gray-80 rounded-md"
                  ></td>
                );
              }
              return (
                <SessionItem
                  key={session.id}
                  data-sessionid={session.id}
                  session={session}
                  toggleLikedness={props.toggleLikedness}
                  as="cell"
                />
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
