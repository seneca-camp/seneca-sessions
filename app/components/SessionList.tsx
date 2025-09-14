import { SessionsViewProps } from "./Sessions";
import { Badge } from "./ui/Badge";
import { LikeButton } from "./LikeButton";

export function SessionList(props: SessionsViewProps) {
    return (
        <ul className="space-y-6 max-w-3xl mx-auto">
            {props.slots.map((slot) => (
                <li key={slot.id} className="bg-gray-90 rounded-lg p-4">
                    <div className="flex flex-row justify-center mb-3 text-2xl">
                        <Badge>{slot.time}</Badge>
                    </div>
                    <div className="space-y-3">
                        {props.sessions.filter(s => s.slot === slot.id).map((session) => (
                            <div key={session.id} className={`flex items-center justify-between p-3 rounded border border-2 transition-colors ${session.liked ? 'bg-deeppurple-20 border-deeppurple-40 hover:bg-deeppurple-20' : 'bg-fancyorange-10 border-fancyorange-40 hover:bg-fancyorange-20'}`} >
                                <div>
                                    <p className="font-bold text-gray-90">{session.title}</p>
                                    <p className={`text-gray-80 text-sm`}>{session.room}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {session.note && (
                                        <a href={session.note} target="_blank" rel="noopener noreferrer" className="text-gray-60 hover:text-gray-80 p-2" title="Open session notes">
                                            <i className="ri-file-text-line text-lg"></i>
                                        </a>
                                    )}
                                    <LikeButton liked={session.liked} onClick={() => props.toggleLikedness(session.id)} />
                                </div>
                            </div>
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