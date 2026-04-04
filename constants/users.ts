export const VALID_USER = {
    username: process.env.VALID_USERNAME,
    password: process.env.VALID_PASSWORD,
    handle: `@${process.env.VALID_USERNAME}`
};

export const INVALID_PASSWORD = {
    username: process.env.VALID_USERNAME,
    password: "wrongPassword",
    handle: `@${process.env.VALID_USERNAME}`
};

export const INVALID_USERNAME = {
    username: "wrongUsername",
    password: process.env.VALID_PASSWORD,
    handle: `@${process.env.VALID_USERNAME}`
};
