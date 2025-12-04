import { openDb } from '../config/database.js';

export async function createUser(email, senhaHash) {
    const db = await openDb();
    const result = await db.run(
        'INSERT INTO usuarios (email, senha) VALUES (?, ?)', 
        email, 
        senhaHash
    );
    return { id: result.lastID, email };
}
