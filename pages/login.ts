import { expect } from "@playwright/test";

const usernameInputLocator = '[data-test="signin-username"] input';
const passwordInputLocator = '[data-test="signin-password"] input';
const submitButtonLocator = '[data-test="signin-submit"]';
const signUpButtonLocator = '[data-test="signup"]';
const errorMessageLocator = '[data-test="signin-error"]';

export async function login(page: any, username: string, password: string) {
  const usernameInput = page.locator(usernameInputLocator);
  await usernameInput.waitFor();
  await usernameInput.fill(username);

  const passwordInput = page.locator(passwordInputLocator);
  await passwordInput.waitFor();
  await passwordInput.fill(password);

  const signupButton = page.locator(submitButtonLocator);
  await signupButton.waitFor();
  await signupButton.click();
}

export async function verifyErrorMessage(page: any, errorMessage: string) {
  const errorMessageElement = page.locator(errorMessageLocator);
  await expect(errorMessageElement).toContainText(errorMessage);
}

export async function goToSignUpPage(page: any) {
  const signUpButton = page.locator(signUpButtonLocator);
  await signUpButton.waitFor();
  await signUpButton.click();
  // due to an issue, a second click is needed to navigate to the signup page
  await signUpButton.click();
  await page.waitForURL("/signup");
}
