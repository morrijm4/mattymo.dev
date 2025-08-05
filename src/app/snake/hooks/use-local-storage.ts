import { useCallback, useEffect, useState } from "react";

export function useLocalStorage(key: string, initialValue: string): readonly [string, (val: string) => void];
export function useLocalStorage(key: string): readonly [string | undefined, (val: string) => void];
export function useLocalStorage(key: string, initialValue?: string): readonly [string | undefined, (val: string) => void] {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        const val = window.localStorage.getItem(key) ?? undefined;

        if (val != null) {
            setValue(val);
        }
    }, [key])

    return [value, useCallback((val: string) => {
        window.localStorage.setItem(key, val);
        setValue(val);
    }, [key])] as const;
}
