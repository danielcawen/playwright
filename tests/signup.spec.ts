import { test } from "@playwright/test";
import { faker } from '@faker-js/faker';
import * as loginPage from "../pages/login.ts";
import * as signupPage from "../pages/signup.ts";
import * as onboardPage from "../pages/onboard.ts";

test("can create a new user", async ({ page }) => {
    let firstName = faker.person.firstName();
    let lastName = faker.person.lastName();
    let username = faker.internet.username({ firstName: firstName, lastName: lastName });
    let password = faker.internet.password();
    let confirmPassword = password;

    const newUser = {
        firstName,
        lastName,
        username,
        password,
        confirmPassword
    };

    await page.goto("/");
    await loginPage.goToSignUpPage(page);
    await signupPage.signup(page, newUser);
    await loginPage.login(page, newUser.username, newUser.password);
    await onboardPage.onboardDashboardIsDisplayed(page);
});
