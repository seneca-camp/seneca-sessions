import React from "react";
import style from "~/css/admin.index.module.css";

export type DragDropCellProps = React.TdHTMLAttributes<HTMLTableCellElement> & {
    id: string;
    children?: React.ReactNode;
    onDragStart?: (event: React.DragEvent<HTMLElement>) => void;
    onDrop: (event: React.DragEvent<HTMLElement>) => void;
};

export const DragDropCell = React.forwardRef<HTMLTableCellElement, DragDropCellProps>((props: DragDropCellProps, ref) => {
    const addDropEffect = (event: React.DragEvent<HTMLElement>) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
    };

    const addHoverEffect = (event: React.DragEvent<HTMLElement>) => {
        event.currentTarget.classList.add(style.hoverTarget, style.slotCell);
    };

    const removeHoverEffect = (event: React.DragEvent<HTMLElement>) => {
        event.currentTarget.classList.remove(style.hoverTarget);
    };

    const animateOnDrop = (event: React.DragEvent<HTMLElement>) => {
        event.currentTarget.classList.add(style.dropPulse);
        props.onDrop(event)
    }

    const animateOnDragStart = (event: React.DragEvent<HTMLElement>) => {
        if (!props.onDragStart) {
            return;
        }
        event.currentTarget.classList.add(style.dragging, style.slotCell);
        event.dataTransfer.dropEffect = "move";
        event.dataTransfer.effectAllowed = "move";
        props.onDragStart(event);
    }

    const { children, onDrop, id, ...rest } = props;

    return (
        <td
            id={id}
            onDrop={animateOnDrop}
            draggable={props.onDragStart !== undefined}
            onDragOver={addDropEffect}
            onDragStart={animateOnDragStart}
            onDragEnter={addHoverEffect}
            onDragLeave={removeHoverEffect}
            className={style.slotCell}
            ref={ref}
            {...rest}
        >
            {props.children}
        </td>
    );
});