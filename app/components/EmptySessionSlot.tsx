import { useSubmit } from "react-router";
import { DragDropCell } from "./DragDropCell";

export function EmptySessionSlot(props: { slotId: number, room: string }) {
    const submit = useSubmit();
    const onSessionMove = async (event: React.DragEvent<HTMLElement>) => {
        const sessionId = event.dataTransfer.getData("sessionId");
        const slot = event.currentTarget.getAttribute("data-slot");
        const room = event.currentTarget.getAttribute("data-room");
        if (!slot || !room) {
            return;
        }
        const formData = new FormData();
        formData.append("type", "move");
        formData.append("sessionId", sessionId);
        formData.append("toSlot", slot);
        formData.append("toRoom", room);
        await submit(formData, { method: "POST" });
    };

    return (
        <DragDropCell
            className="bg-gray-80 rounded-md"
            id={`slot-${props.slotId}-room-${props.room}`}
            data-slot={props.slotId}
            data-room={props.room}
            onDrop={onSessionMove}
        />
    );
}