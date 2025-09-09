import React from "react";

export type ListItemProps = React.LiHTMLAttributes<HTMLLIElement> & {
    children?: React.ReactNode;
};

export const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>((props: ListItemProps, ref) => {
    const { children, className, ...rest } = props;
    return (
        <li ref={ref} className={`bg-gray-90 rounded-lg p-4 ${className}`} {...rest}>
            {children}
    </li>
    );
});