import { test } from "@playwright/test";
import * as loginPage from "../pages/login";
import { verifyLoggedUser } from "../pages/sidebar";
import * as users from "../constants/users";

test("can login with valid credentials", async ({ page }) => {
  const viewport = page.viewportSize();
  const isMobile = viewport!.width < 768;

  await page.goto("/");

  await loginPage.login(page, users.VALID_USER.username, users.VALID_USER.password);

  await verifyLoggedUser(page, users.VALID_USER.handle, isMobile);
});

test("cannot login with invalid password", async ({ page }) => {
  await page.goto("/");

  await loginPage.login(page, users.INVALID_PASSWORD.username, users.INVALID_PASSWORD.password);

  await loginPage.verifyErrorMessage(page, "Username or password is invalid");
});
