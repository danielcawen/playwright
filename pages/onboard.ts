import { expect } from "@playwright/test";

const onboardDashboardLocator = '[data-test="user-onboarding-dialog-content"]';
const onboardDashboardNextButtonLocator = '[data-test="user-onboarding-next"]';
const onboardDashboardDoneButtonLocator = '[data-test="user-onboarding-next"]';


export async function onboardDashboardIsDisplayed(page: any) {
    const onboardDashboard = page.locator(onboardDashboardLocator);
    await expect(onboardDashboard).toBeVisible();
}

export async function clickOnOnboardDashboardNextButton(page: any) {
    const onboardDashboardNextButton = page.locator(onboardDashboardNextButtonLocator);
    await expect(onboardDashboardNextButton).toBeVisible();
    await onboardDashboardNextButton.click();
}

export async function clickOnOnboardDashboardDoneButton(page: any) {
    const onboardDashboardDoneButton = page.locator(onboardDashboardDoneButtonLocator);
    await expect(onboardDashboardDoneButton).toBeVisible();
    await onboardDashboardDoneButton.click();
}