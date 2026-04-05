import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine the current environment. Default to 'local' if not specified.
const env = process.env.NODE_ENV || 'local';

// Build the path to the correct .env file (e.g., .env.local, .env.staging, .env.prod)
const envFilePath = path.resolve(__dirname, `.env.${env}`);
dotenv.config({ path: envFilePath });

// Export the database configuration
export const dbConfig = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
};
