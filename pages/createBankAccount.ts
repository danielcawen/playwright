const bankNameInputLocator = '[data-test="bank-account-name-input"] input';
const routingNumberInputLocator = '[data-test="bank-account-routing-number-input"] input';
const accountNumberInputLocator = '[data-test="bankaccount-accountNumber-input"] input';
const createBankAccountButtonLocator = '[data-test="bankaccount-submit"]';

export async function createBankAccount(page: any, bankName: string, routingNumber: string, accountNumber: string) {
    const bankNameInput = page.locator(bankNameInputLocator);
    await bankNameInput.waitFor();
    await bankNameInput.fill(bankName);

    const routingNumberInput = page.locator(routingNumberInputLocator);
    await routingNumberInput.waitFor();
    await routingNumberInput.fill(routingNumber);

    const accountNumberInput = page.locator(accountNumberInputLocator);
    await accountNumberInput.waitFor();
    await accountNumberInput.fill(accountNumber);

    const createBankAccountButton = page.locator(createBankAccountButtonLocator);
    await createBankAccountButton.waitFor();
    await createBankAccountButton.click();
}
