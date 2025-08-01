import { useEffect } from "react";

export function useKeyPress(
    key: string,
    action: (event: KeyboardEvent) => void
) {
    useEffect(() => {
        const controller = new AbortController();

        console.log('init keyboard handler');

        document.addEventListener('keypress', (event) => {
            console.log('key', event.key);
            if (event.key === key) {
                action(event);
            }
        }, { signal: controller.signal });

        return controller.abort;
    }, [key, action]);
}
