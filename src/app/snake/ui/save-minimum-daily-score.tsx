'use client';

import { useEffect } from 'react';
import { useLocalStorage } from '../hooks/use-local-storage';

type SaveMinimumDailyScoreProps = {
    score: number;
}

export function SaveMinimumDailyScore({ score }: SaveMinimumDailyScoreProps) {
    const [, setMinimumDailyScore] = useLocalStorage('minimum-daily-score');

    useEffect(() => {
        setMinimumDailyScore(score.toString());
    }, [score, setMinimumDailyScore]);

    return null;
}
