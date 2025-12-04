import bcrypt from 'bcryptjs';
import * as Usuario from '../models/Usuario.js';

export async function registrarUsuario(req, res) {
    const { email, senha } = req.body;

    // Validação básica
    if (!email || !senha) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    // 1. Criptografar a senha (O pulo do gato!)
    const senhaHash = await bcrypt.hash(senha, 10); // 10 é o "custo" (força) do hash

    try {
        const novoUsuario = await Usuario.createUser(email, senhaHash);
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!', user: novoUsuario });
    } catch (error) {
        // Erro comum: Email já existe (constraint UNIQUE)
        res.status(400).json({ message: 'Erro ao cadastrar. Esse email já existe?' });
    }
}
