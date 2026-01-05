import 'dotenv/config'; // Isso carrega o .env automaticamente se estiver na raiz ou configura via path
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { query } from '../src/config/database.js';

// Configurar o dotenv apontando para o arquivo correto
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../../.env') });

const runMigration = async () => {
    try {
        console.log('Adicionando coluna autor na tabela piadas...');
        await query('ALTER TABLE piadas ADD COLUMN IF NOT EXISTS autor VARCHAR(255)');
        console.log('Coluna autor adicionada com sucesso!');
        process.exit(0);
    } catch (err) {
        console.error('Erro ao adicionar coluna:', err);
        process.exit(1);
    }
};

runMigration();
