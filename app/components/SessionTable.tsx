import { SessionsViewProps } from "./Sessions";
import styles from "../css/index.module.css";
import { rooms } from "../models/rooms";

export function SessionTable(props: SessionsViewProps) {
    return (
        <table className={styles.sessionTable}>
            <thead className="text-lg text-white uppercase">
                <tr key="table-head" className="min-width-fit">
                    <th className={styles.roomName} key="head-1" ></th>
                    {rooms.map((room) => (
                        <th className={styles.roomName} key={room}>{room}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {props.slots.map(({ id: slotId, time }) => (
                    <tr className="min-h-100 min-width-fit" key={"row" + slotId}>
                        <th className={styles.sessionTime}>{time}</th>
                        {rooms.map((room, roomIndex) => {
                            const session = props.sessions.filter(s => s.room === room && s.slot === slotId)[0];
                            if (!session) {
                                return <td key={`slot-${slotId}-room-${roomIndex}`} className={styles.sessionName}></td>;
                            }
                            return (
                                <td className={`${styles.sessionName} ${styles.hasContent} ${session.liked ? styles.likedSession : ""}`}
                                    key={session.id}
                                    data-sessionid={session.id}>
                                    <div onClick={() => props.toggleLikedness(session.id)}>
                                        <p>{session.title}</p>
                                    </div>
                                    <hr />
                                    <a href={session.note} target="_blank"><div className={`text-center`}>Session Notes - 📝</div></a>
                                </td>
                            )
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}