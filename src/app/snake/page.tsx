import { Suspense } from "react";
import { Leaderboards } from "./ui/leaderboard";
import { ScreenManager } from './ui/screen-manager';

export default async function Page() {
    return (
        <>
            <ScreenManager />
            <Suspense>
                <Leaderboards />
            </Suspense>
        </>
    );
}
