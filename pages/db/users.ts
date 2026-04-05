
import { Client } from 'pg';
import { dbConfig } from '../../config';

const client = new Client(dbConfig);

export async function getAllUsers() {
    await client.connect();
    const result = await client.query('SELECT * FROM users');
    await client.end();
    return result.rows;
}