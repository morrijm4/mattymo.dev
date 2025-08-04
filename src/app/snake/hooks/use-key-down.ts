import { useEffect } from "react";

export function useKeyDown(
    callback: (event: KeyboardEvent) => void,
) {
    useEffect(() => {
        const controller = new AbortController();

        document.addEventListener('keydown', (event) => {
            event.preventDefault();
            callback(event);
        }, { signal: controller.signal });

        return () => controller.abort();
    }, [callback]);
}
