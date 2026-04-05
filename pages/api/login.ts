import { expect } from "@playwright/test";

export async function login(apiContext: any, username: string, password: string, expectedStatus: number = 200) {
    const loginResponse = await apiContext.post(`/login`, {
        data: {
            type: "LOGIN",
            username: username,
            password: password,
        }
    });

    expect(loginResponse.status()).toBe(expectedStatus);

    if (expectedStatus === 200) {
        const responseBody = await loginResponse.json();

        expect(responseBody).toHaveProperty('user');
        expect(responseBody.user).toHaveProperty('id');
        expect(responseBody.user).toHaveProperty('uuid');
        expect(responseBody.user).toHaveProperty('email');
        expect(responseBody.user).toHaveProperty('balance');
        expect(responseBody.user).toMatchObject({
            username: username
        });
    }
}
