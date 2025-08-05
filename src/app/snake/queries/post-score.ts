import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { scoreTable, type InsertScore } from '../../../db/schema/score';

export async function postScore(db: NeonHttpDatabase, score: InsertScore) {
    return db.insert(scoreTable).values(score);
}
