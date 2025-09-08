import { SessionsViewProps } from "./Sessions";
import { rooms } from "../models/rooms";
import { LikeButton } from "./LikeButton";

export function SessionTable(props: SessionsViewProps) {
    return (
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
                {props.slots.map(({ id: slotId, time }) => (
                    <tr className="min-h-100 min-width-fit px-4" key={"row" + slotId}>
                        <th className="text-xl text-white text-left p-4">{time}</th>
                        {rooms.map((room, roomIndex) => {
                            const session = props.sessions.filter(s => s.room === room && s.slot === slotId)[0];
                            if (!session) {
                                return <td key={`slot-${slotId}-room-${roomIndex}`} className="bg-gray-80 rounded-md"></td>;
                            }
                            return (
                                <td className={`${session.liked ? 'bg-deeppurple-20 border-deeppurple-40' : 'bg-fancyorange-10 border-fancyorange-40 '} cursor-pointer relative border border-2 rounded-md p-4`}
                                    key={session.id}
                                    onClick={() => props.toggleLikedness(session.id)}
                                    data-sessionid={session.id}>
                                    <LikeButton className="absolute top-0 right-0" liked={session.liked} onClick={() => props.toggleLikedness(session.id)} />
                                    <div className="flex flex-row justify-between items-start static">
                                        <p className="font-bold text-gray-90">{session.title}</p>
                                    </div>
                                    <Note href={session.note} />
                                </td>
                            )
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export function Note({ href }: { href: string }) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-gray-60 hover:text-gray-80" title="Open session notes">
            <i className="ri-file-text-line text-lg"></i> Notes 
        </a>
    );
}