import { getDailyScores } from '../actions/get-scores';
import { useEffect, useState } from "react";
import type { OpUnitType } from 'dayjs';

export function useScores(_unit: OpUnitType) {
    const [scores, setScores] = useState<{ score: number }[]>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<unknown>();

    useEffect(() => {
        async function main() {
            try {
                setIsLoading(true);
                setScores(await getDailyScores());
            } catch (error: unknown) {
                setError(error);
            } finally {
                setIsLoading(false);
            }
        }

        main();
    }, []);

    return { scores, error, isLoading };
}
