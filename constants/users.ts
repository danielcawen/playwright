import { userConfig } from '../config';

const { username: VALID_USERNAME, password: VALID_PASSWORD } = userConfig;

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
