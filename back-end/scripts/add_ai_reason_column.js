import { query } from '../src/config/database.js';

async function addAiReasonColumn() {
    try {
        await query(`
      ALTER TABLE piadas 
      ADD COLUMN IF NOT EXISTS justificativa_ia TEXT;
    `);
        console.log('Coluna "justificativa_ia" adicionada com sucesso!');
    } catch (error) {
        console.error('Erro ao adicionar coluna:', error);
    }
}

addAiReasonColumn();