import 'dotenv/config';
import { Config, defineConfig } from 'drizzle-kit';

const url = process.env.DATABASE_URL

if (url == null) {
    throw new Error('Database URL not defined');
}

export const casing: Config['casing'] = 'snake_case';

export default defineConfig({
    out: './src/db/migrations',
    schema: './src/db/schema/*',
    dialect: 'postgresql',
    casing: 'snake_case',
    dbCredentials: {
        url,
    },
});
