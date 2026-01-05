import { query } from '../config/database.js';

class Piada {
    // Cria uma nova piada (pendente por padrão)
    static async criar(pergunta, resposta, autor) {
        const resultado = await query(
            'INSERT INTO piadas (pergunta, resposta, autor, aprovada) VALUES ($1, $2, $3, false) RETURNING *',
            [pergunta, resposta, autor]
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
}

export default Piada;
