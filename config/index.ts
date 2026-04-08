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

/**
 * Ensures that an environment variable is defined.
 * Throws an error if the variable is missing.
 */
function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

// Export the database configuration
export const dbConfig = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
};

// Export the user configuration for tests
export const userConfig = {
    username: requireEnv("VALID_USERNAME"),
    password: requireEnv("VALID_PASSWORD"),
};
