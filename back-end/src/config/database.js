import sqlite3 from 'sqlite3';
import { open } from 'sqlite';


// Função para abrir a conexão com o arquivo do banco
export async function openDb() {
  return open({
    filename: './database.db', // O arquivo será criado na raiz
    driver: sqlite3.Database
  });
}


// Função para criar a tabela se ela não existir
export async function setupDatabase() {
    const db = await openDb();

    await db.exec(`
        CREATE TABLE IF NOT EXISTS piadas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pergunta TEXT NOT NULL,
            resposta TEXT NOT NULL,
            aprovada INTEGER DEFAULT 0,
            data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);
   
    console.log('Banco de dados e Tabela Piadas prontos!');

    await db.exec(`
      CREATE TABLE IF NOT EXISTS usuarios (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          senha TEXT NOT NULL
      );
    `);
    
    console.log('Tabela Usuários criada!');

}
