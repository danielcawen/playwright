import { test } from "@playwright/test";
import * as loginPage from "../../pages/api/login";
import * as users from "../../constants/users";

let apiContext: any;

test.beforeAll(async ({ playwright }) => {
    apiContext = await playwright.request.newContext({
        baseURL: process.env.BASE_URL_API,
        extraHTTPHeaders: {
        },
    });
});

test('login via the api with a incorrect user', async () => {
    await loginPage.login(apiContext, users.VALID_USER.username, "wrongPassword", 401);
});

test('login via the api with a correct user', async () => {
    await loginPage.login(apiContext, users.VALID_USER.username, users.VALID_USER.password, 200);
});
