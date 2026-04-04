import { expect } from "@playwright/test";

const usernameLabelLocator = '[data-test="sidenav-username"]';

export default async function verifyLoggedUser(page: any, username: string) {
    const usernameLabel = page.locator(usernameLabelLocator);
    await expect(usernameLabel).toContainText(username);
}