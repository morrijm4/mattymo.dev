import { desc, between, asc } from "drizzle-orm";
import { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { scoreTable } from "@/db/schema/score";
import { rank } from "../ui/leaderboard";

interface GetScoresOptions {
    limit?: number;
}

export async function getScores(
    db: NeonHttpDatabase,
    { limit = rank.length }: GetScoresOptions = {}
) {
    return db
        .select({
            name: scoreTable.name,
            score: scoreTable.score,
        })
        .from(scoreTable)
        .orderBy(desc(scoreTable.score), asc(scoreTable.createdAt))
        .limit(limit);
}

interface GetScoreseBetweenOptions extends GetScoresOptions {
    start: Date;
    end: Date;
}

export async function getScoresBetween(
    db: NeonHttpDatabase,
    {
        limit = rank.length,
        start,
        end
    }: GetScoreseBetweenOptions
) {
    return db
        .select({
            name: scoreTable.name,
            score: scoreTable.score,
        })
        .from(scoreTable)
        .where(between(scoreTable.createdAt, start, end))
        .orderBy(desc(scoreTable.score), asc(scoreTable.createdAt))
        .limit(limit);
}

