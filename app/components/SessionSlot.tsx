import { Session } from "@prisma/client";
import { useState } from "react";
import { useSubmit } from "react-router";
import { DragDropCell } from "./DragDropCell";
import Button from "~/components/ui/Button";
import { DeleteForm } from "./DeleteForm";

export type SessionSlotProps = {
  session: Session;
}

export function SessionSlot({ session }: SessionSlotProps) {
  const submit = useSubmit();
  const onSessionDragStart = (event: React.DragEvent<HTMLElement>) => {
    event.dataTransfer.setData("sessionId", event.currentTarget.id);
  };

  const onSessionSwitch = async (event: React.DragEvent<HTMLElement>) => {
    const firstSessionId = event.dataTransfer.getData("sessionId");
    const secondSessionId = event.currentTarget.id;
    const formData = new FormData();
    formData.append("type", "switch");
    formData.append("firstSessionId", firstSessionId);
    formData.append("secondSessionId", secondSessionId);
    await submit(formData, { method: "POST" });
  };

  return (
    <DragDropCell
      id={session.id}
      key={session.id}
      onDrop={onSessionSwitch}
      onDragStart={onSessionDragStart}
    >
      <div className="flex p-2 flex-row items-center gap-2">
        <EditForm session={session} />
        <DeleteForm id={session.id}>
          <Button size="icon" variant="ghost" tone="danger" aria-label="Delete session">
            <i className="ri-delete-bin-line text-xl"></i>
          </Button>
        </DeleteForm>
      </div>
    </DragDropCell>
  );
}

function EditForm({ session }: { session: Session }) {
  const [editModus, setEditModus] = useState(false);

  return (
    <form method="post" action={session.scheduleId} onSubmit={() => setEditModus(false)}>
      <input type="hidden" name="type" value="rename" />
      <input type="hidden" name="id" value={session.id} />
      <div className="flex flex-row items-center gap-2">
        <input className={`${editModus ? "border-b-2 border-black" : ""}`} readOnly={!editModus} type="text" name="title" defaultValue={session.title} />
        {!editModus && (
          <Button size="icon" variant="ghost" tone="brand" aria-label="Edit title" onClick={() => setEditModus(!editModus)}>
            <i className="ri-pencil-line text-xl"></i>
          </Button>
        )}
        {editModus && (
          <Button size="icon" variant="solid" tone="brand" aria-label="Save title" type="submit">
            <i className="ri-check-line text-xl"></i>
          </Button>
        )}
      </div>
    </form>
  );
}