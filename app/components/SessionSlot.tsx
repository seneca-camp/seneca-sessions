import { Session } from "@prisma/client";
import { useState } from "react";
import { useSubmit } from "react-router";
import style from "~/css/admin.index.module.css";

export type SessionSlotProps = {
    session: Session;
}

const enableDropping = (event: React.DragEvent<HTMLElement>) => event.preventDefault();

export function SessionSlot({session}: SessionSlotProps) {
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
    <td
      id={session.id}
      key={session.id}
      onDragOver={enableDropping}
      draggable={true}
      onDrop={onSessionSwitch}
      onDragStart={onSessionDragStart}
    >
      <p>{session.title}</p>
      <DeleteForm session={session} />
      <RenameForm session={session} />
    </td>
  );
}

function DeleteForm({session}: { session: Session }) {
  const [isCollapsed, setCollapsed] = useState(true);

  return (
    <form
      className={`${style.slotForm} ${isCollapsed ? style.collapsed : style.uncollapsed}`}
      method="post"
      action="/admin/"
    >
      <span
        className={style.showForm}
        onClick={() => setCollapsed(!isCollapsed)}
      >
        Session löschen:
      </span>
      <input type="hidden" name="type" value="delete" />
      <input type="hidden" name="slot" value={session.slot} />
      <input type="hidden" name="room" value={session.room} />
      <button type="submit">Eintrag löschen</button>
    </form>
  );
}

function RenameForm({session}: { session: Session }) {
  const [isCollapsed, setCollapsed] = useState(true);

  return (
    <form
      className={`${style.slotForm} ${isCollapsed ? style.collapsed : style.uncollapsed}`}
      method="post"
      action="/admin/"
    >
      <span
        className={style.showForm}
        onClick={() => {
          setCollapsed(!isCollapsed);
        }}
      >
        Session umbenennen:
      </span>
      <input type="hidden" name="type" value="rename" />
      <input type="hidden" name="slot" value={session.slot} />
      <input type="hidden" name="room" value={session.room} />
      <input type="text" name="title" defaultValue={session.title} />
      <button type="submit">Umbenennen</button>
    </form>
  );
}