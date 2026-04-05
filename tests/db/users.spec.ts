import { test, expect } from "@playwright/test";
import * as users from "../../pages/db/users";

test('fetches all users', async () => {
    const allUsers = await users.getAllUsers();
    expect(allUsers).toHaveLength(5);
})
