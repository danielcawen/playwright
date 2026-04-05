
const firstNameInputLocator = '[data-test="signup-first-name"] input';
const lastNameInputLocator = '[data-test="signup-last-name"] input';
const usernameInputLocator = '[data-test="signup-username"] input';
const passwordInputLocator = '[data-test="signup-password"] input';
const confirmPasswordInputLocator = '[data-test="signup-confirmPassword"] input';
const submitButtonLocator = '[data-test="signup-submit"]';


export async function signup(page: any, args: any) {
    const { firstName, lastName, username, password, confirmPassword } = { ...args };

    const firstNameInput = page.locator(firstNameInputLocator);
    await firstNameInput.waitFor();
    await firstNameInput.fill(firstName);

    const lastNameInput = page.locator(lastNameInputLocator);
    await lastNameInput.waitFor();
    await lastNameInput.fill(lastName);

    const usernameInput = page.locator(usernameInputLocator);
    await usernameInput.waitFor();
    await usernameInput.fill(username);

    const passwordInput = page.locator(passwordInputLocator);
    await passwordInput.waitFor();
    await passwordInput.fill(password);

    const confirmPasswordInput = page.locator(confirmPasswordInputLocator);
    await confirmPasswordInput.waitFor();
    await confirmPasswordInput.fill(confirmPassword);

    const signupButton = page.locator(submitButtonLocator);
    await signupButton.waitFor();
    await signupButton.click();
}