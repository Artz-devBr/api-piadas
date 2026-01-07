import { query } from '../config/database.js';

class Piada {
    // Cria uma nova piada
    static async criar(pergunta, resposta, autor, aprovada = false, justificativa_ia = null) {
        const resultado = await query(
            'INSERT INTO piadas (pergunta, resposta, autor, aprovada, justificativa_ia) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [pergunta, resposta, autor, aprovada, justificativa_ia]
        );
        return resultado.rows[0];
    }

    // Busca uma piada aleatória aprovada
    static async buscarAleatoria() {
        const resultado = await query(
            'SELECT * FROM piadas WHERE aprovada = true ORDER BY RANDOM() LIMIT 1'
        );
        return resultado.rows[0];
    }

    // Lista todas as pendentes
    static async listarPendentes() {
        const resultado = await query(
            'SELECT * FROM piadas WHERE aprovada = false'
        );
        return resultado.rows;
    }

    // Aprova uma piada pelo ID
    static async aprovar(id) {
        await query(
            'UPDATE piadas SET aprovada = true WHERE id = $1',
            [id]
        );
    }
    // Deleta uma piada pelo ID
    static async deletar(id) {
        await query(
            'DELETE FROM piadas WHERE id = $1',
            [id]
        );
    }
}

export default Piada;
