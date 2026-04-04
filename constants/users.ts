function requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

const VALID_USERNAME = requireEnv("VALID_USERNAME");
const VALID_PASSWORD = requireEnv("VALID_PASSWORD");

export const VALID_USER = {
    username: VALID_USERNAME,
    password: VALID_PASSWORD,
    handle: `@${VALID_USERNAME}`
};

export const INVALID_PASSWORD = {
    username: VALID_USERNAME,
    password: "wrongPassword",
    handle: `@${VALID_USERNAME}`
};

export const INVALID_USERNAME = {
    username: "wrongUsername",
    password: VALID_PASSWORD,
    handle: `@${VALID_USERNAME}`
};
