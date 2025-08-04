import { useCallback, useEffect, useState } from "react";

const key = 'high-score';

export function useHighScore() {
    const [highScore, setHighScore] = useState(0);

    useEffect(() => {
        setHighScore(Number(window.localStorage.getItem(key)));
    }, [])

    return [highScore, useCallback((score: number) => {
        window.localStorage.setItem(key, score.toString());
        setHighScore(score);
    }, [])] as const;
}
