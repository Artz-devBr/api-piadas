import Piada from '../models/Piada.js';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const criarPiada = async (req, res) => {
    const { pergunta, resposta, autor } = req.body;
    try {
        const prompt = `Analise a seguinte piada e diga se ela é ofensiva, preconceituosa (+18) ou imprópria de alguma forma. 
        Piada: "${pergunta} ${resposta}"
        Se for tranquila e aceitável, responda apenas com a palavra "APROVADA".
        Se for imprópria, responda "REPROVADA: " seguido de uma breve justificativa em português.`;

        // OBS: Verifique se o modelo 'gemini-2.5-flash' existe. 
        // Atualmente os comuns são 'gemini-1.5-flash' ou 'gemini-2.0-flash-exp'.
        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash', // Ajustei para um modelo estável, verifique se vc tem acesso ao 2.5
            contents: [
                {
                    role: 'user',
                    parts: [{ text: prompt }]
                }
            ]
        });

        // --- CORREÇÃO AQUI ---
        // A nova SDK retorna a estrutura de dados direta. 
        // Acessamos o texto dentro de candidates -> content -> parts -> text
        const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text || "";

        let aprovada = false;
        let justificativa = null;

        if (responseText && responseText.toUpperCase().includes('APROVADA')) {
            aprovada = true;
        } else {
            aprovada = false;
            // Limpeza extra para garantir que só venha o texto da justificativa
            justificativa = responseText
                ? responseText.replace(/REPROVADA:?/i, '').trim()
                : "Sem resposta da IA";
            justificativa = justificativa.replace(/^"|"$/g, '');
        }

        const novaPiada = await Piada.criar(pergunta, resposta, autor, aprovada, justificativa);
        res.status(201).json(novaPiada);

    } catch (erro) {
        console.error("Erro na Validação IA:", erro);
        // Fallback
        try {
            const novaPiada = await Piada.criar(pergunta, resposta, autor, false, "Erro na verificação automática (IA Indisponível).");
            res.status(201).json(novaPiada);
        } catch (dbError) {
            res.status(500).json({ erro: 'Erro ao salvar piada' });
        }
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

export const deletarPiada = async (req, res) => {
    const { id } = req.params;
    try {
        await Piada.deletar(id);
        res.json({ mensagem: 'Piada deletada com sucesso!' });
    } catch (erro) {
        res.status(500).json({ erro: 'Erro ao deletar piada' });
    }
};
