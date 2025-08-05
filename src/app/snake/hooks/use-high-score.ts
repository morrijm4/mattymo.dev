import { useCallback, useEffect, useRef, useState } from "react";

export function useLocalStorage(key: string, initialValue?: string) {
    const [value, setValue] = useState(initialValue);
    const ref = useRef(initialValue);

    useEffect(() => {
        setValue(window.localStorage.getItem(key) ?? ref.current);
    }, [key])

    return [value, useCallback((val: string) => {
        window.localStorage.setItem(key, val);
        setValue(val);
    }, [key])] as const;
}
