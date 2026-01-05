import Piada from '../models/Piada.js'; // Importamos o Model

export const submeterPiada = async (req, res) => {
    const { pergunta, resposta, autor } = req.body;
    try {
        const novaPiada = await Piada.criar(pergunta, resposta, autor);
        res.status(201).json(novaPiada);
    } catch (erro) {
        console.log(erro)
        res.status(500).json({ erro: 'Erro ao salvar piada' });
    }
};

export const buscarPiadaAleatoria = async (req, res) => {
    try {
        const piada = await Piada.buscarAleatoria();

        if (!piada) {
            return res.status(404).json({ mensagem: 'Nenhuma piada encontrada' });
        }

        res.json(piada);
    } catch (erro) {
        console.log(erro)
        res.status(500).json({ erro: 'Erro ao buscar piada' });
    }
};

export const buscarDezPiadasAleatorias = async (req, res) => {
    try {
        const piada = await Piada.buscarAleatoria();

        if (!piada) {
            return res.status(404).json({ mensagem: 'Nenhuma piada encontrada' });
        }

        res.json(piada);
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao buscar piada' });
    }
};

export const listarPiadasPendentes = async (req, res) => {
    try {
        const piadas = await Piada.listarPendentes();
        res.json(piadas);
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao listar pendentes' });
    }
};

export const aprovarPiada = async (req, res) => {
    const { id } = req.params;
    try {
        await Piada.aprovar(id);
        res.json({ mensagem: 'Piada aprovada com sucesso!' });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao aprovar piada' });
    }
};
