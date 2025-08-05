import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { casing } from '../../drizzle.config';

const url = process.env.DATABASE_URL;

if (url == null) {
    throw new Error('Database url not defined');
}

export const db = drizzle(url, { casing });
