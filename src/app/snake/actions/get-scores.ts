'use server';

import { getScoresBetween } from "../queries/get-scores";
import { db } from '@/db/client';
import { createDateRange } from '@/lib/create-date-range';

export async function getDailyScores() {
    return getScoresBetween(db, createDateRange('day'));
}

export async function getWeeklyScores() {
    return getScoresBetween(db, createDateRange('week'));
}

export async function getMonthlyScores() {
    return getScoresBetween(db, createDateRange('month'));
}

