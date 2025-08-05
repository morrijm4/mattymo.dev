'use server';

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import { postScore } from '../queries/post-score';
import { DEFAULT_COLUMN_SIZE, DEFAULT_ROW_SIZE } from "../grid";
import { db } from "@/db/client";

const MAX_SCORE = DEFAULT_COLUMN_SIZE * DEFAULT_ROW_SIZE;

export async function submitScore(score: number, formData: FormData): Promise<number> {
    if (score > MAX_SCORE) {
        console.error('score greater than max', score);
        notFound();
    }

    const name = formData.get('name');

    if (name == null || typeof name !== 'string' || name.length !== 3) {
        console.error('invalid name', name);
        notFound();
    }

    await postScore(db, { score, name });

    revalidatePath('/snake');
    redirect('/snake');
    return score;
}
