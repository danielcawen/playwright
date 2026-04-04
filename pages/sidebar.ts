import { expect } from "@playwright/test";

const usernameLabelLocator = '[data-test="sidenav-username"]';
const hamburgerMenuLocator = '[data-test="sidenav-toggle"]';

export async function verifyLoggedUser(page: any, username: string, isMobile: boolean) {
    if (isMobile) await page.click(hamburgerMenuLocator);
    const usernameLabel = page.locator(usernameLabelLocator);
    await expect(usernameLabel).toContainText(username);
}