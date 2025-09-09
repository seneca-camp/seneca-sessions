import { Dispatch, SetStateAction, useEffect, useState } from "react";

export type PersistedState<T> = [T, Dispatch<SetStateAction<T>>];

export function usePersistedState<T>(defaultValue: T, key: string): PersistedState<T> {
    if (typeof document === "undefined") { // todo: proper frontend-only code, but no time to figure this out now
        return [defaultValue, () => { }];
    }

    const [value, setValue] = useState<T>(() => {
        const value = window.localStorage.getItem(key);

        return value ? (JSON.parse(value) as T) : defaultValue;
    });

    useEffect(() => {
        window.localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, (...args) => { console.log("setting"); setValue(...args) }];
}