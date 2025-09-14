import { Session } from "@prisma/client";
import { useState } from "react";
import { useSubmit } from "react-router";
import { DragDropCell } from "./DragDropCell";
import Button from "~/components/ui/Button";
import { DeleteForm } from "./DeleteForm";

export type SessionSlotProps = {
  session: Session;
};

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
      className="bg-fancyorange-10 rounded-md cursor-grab relative"
      key={session.id}
      onDrop={onSessionSwitch}
      onDragStart={onSessionDragStart}
    >
      <div className="flex p-2 flex-row items-center justify-center gap-2 relative">
        <EditForm session={session} />
      </div>
      <DeleteForm id={session.id}>
        <Button
          size="icon"
          variant="ghost"
          color="danger"
          aria-label="Delete session"
          className="absolute bottom-0 right-0"
        >
          <i className="ri-delete-bin-line text-xl"></i>
        </Button>
      </DeleteForm>
    </DragDropCell>
  );
}

function EditForm({ session }: { session: Session }) {
  const [editModus, setEditModus] = useState(false);

  return (
    <form
      method="post"
      action={session.scheduleId}
      onSubmit={() => setEditModus(false)}
    >
      <input type="hidden" name="type" value="rename" />
      <input type="hidden" name="id" value={session.id} />
      <div className="flex flex-row items-center gap-2">
        <input
          className={`w-auto ${editModus ? "border-b-2 border-black" : ""}`}
          readOnly={!editModus}
          type="text"
          name="title"
          defaultValue={session.title}
        />
        {!editModus && (
          <Button
            size="icon"
            variant="ghost"
            color="neutral"
            aria-label="Edit title"
            onClick={() => setEditModus(!editModus)}
          >
            <i className="ri-pencil-line hover:text-white text-black text-xl"></i>
          </Button>
        )}
        {editModus && (
          <Button
            size="icon"
            variant="ghost"
            color="neutral"
            aria-label="Save title"
            type="submit"
          >
            <i className="ri-check-line hover:text-white text-black text-xl"></i>
          </Button>
        )}
      </div>
    </form>
  );
}
