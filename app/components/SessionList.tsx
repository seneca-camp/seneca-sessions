import { SessionsViewProps } from "./Sessions";
import { Badge } from "./ui/Badge";
import { SessionItem } from "./SessionItem";

export function SessionList(props: SessionsViewProps) {
    return (
        <ul className="space-y-6 max-w-3xl mx-auto">
            {props.slots.map((slot) => (
                <li key={slot.id} className="bg-gray-90 rounded-lg p-4">
                    <div className="flex flex-row justify-center mb-3 text-2xl">
                        <Badge>{slot.time}</Badge>
                    </div>
                    <div className="space-y-3 flex flex-col">
                        {props.sessions.filter(s => s.slot === slot.id).map((session) => (
                            <SessionItem
                                key={session.id}
                                data-sessionid={session.id}
                                session={session}
                                toggleLikedness={props.toggleLikedness}
                                displayRoom
                            />
                        ))}
                        {props.sessions.filter(s => s.slot === slot.id).length === 0 && (
                            <div className="italic text-gray-40">No sessions in this slot.</div>
                        )}
                    </div>
                </li>
            ))}
        </ul>
    );
}