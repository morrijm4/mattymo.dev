import { useEffect } from "react";

export function useKeyDown(
    keys: string[],
    callback: (event: KeyboardEvent) => void,
) {
    useEffect(() => {
        const controller = new AbortController();

        document.addEventListener('keydown', (event) => {
            if (keys.includes(event.key)) {
                event.preventDefault();
                callback(event);
            }
        }, { signal: controller.signal });

        return controller.abort;
    }, [keys, callback]);
}
