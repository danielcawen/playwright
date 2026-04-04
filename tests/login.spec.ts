import { test } from "@playwright/test";
import * as loginPage from "../pages/login.ts";
import verifyLoggedUser from "../pages/sidebar.ts";
import * as users from "../constants/users.ts";

test("can login with valid credentials", async ({ page }) => {
  await page.goto("/");

  await loginPage.login(page, users.VALID_USER.username, users.VALID_USER.password);

  await verifyLoggedUser(page, users.VALID_USER.handle);
});

test("cannot login with invalid password", async ({ page }) => {
  await page.goto("/");

  await loginPage.login(page, users.INVALID_PASSWORD.username, users.INVALID_PASSWORD.password);

  await loginPage.verifyErrorMessage(page, "Username or password is invalid");
});
