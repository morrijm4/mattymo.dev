import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const url = process.env.DATABASE_URL

if (url == null) {
    throw new Error('Database URL not defined');
}

export default defineConfig({
    out: './src/db/migrations',
    schema: './src/db/schema/*',
    dialect: 'postgresql',
    casing: 'snake_case',
    dbCredentials: {
        url,
    },
});
