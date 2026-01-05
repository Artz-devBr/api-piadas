import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import Usuario from '../models/Usuario.js'; // Importamos o Model

export const registrarUsuario = async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Regra de negócio: Criptografar senha
        const senhaHash = await bcrypt.hash(senha, 10);
        
        // Model: Salvar no banco
        const novoUsuario = await Usuario.criar(email, senhaHash);
        
        res.status(201).json(novoUsuario);
    } catch (erro) {
        console.log(erro)
        res.status(400).json({ erro: 'Erro ao registrar (Email já existe?)' });
    }
};

export const login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Model: Buscar usuário
        const usuario = await Usuario.buscarPorEmail(email);

        if (!usuario) {
            return res.status(401).json({ erro: 'Credenciais inválidas' });
        }

        // Regra de negócio: Validar senha
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ erro: 'Credenciais inválidas' });
        }

        // Regra de negócio: Gerar Token
        const token = jwt.sign(
            { userId: usuario.id, email: usuario.email },
            process.env.JWT_SECRET || 'secreto',
            { expiresIn: '1h' }
        );

        res.json({ token });
    } catch (erro) {
        console.log(erro)
        res.status(500).json({ erro: 'Erro no servidor' });
    }
};
