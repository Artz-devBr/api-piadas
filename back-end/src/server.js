import 'dotenv/config';
import app from './app.js'; // Importação com .js
import express from 'express';
import piadaRoutes from './routes/piadaRoutes.js'; // Importa as rotas
import authRoutes from './routes/authRoutes.js';

// Importa a função de configuração do banco
import { setupDatabase } from './config/database.js';

// Middleware essencial para entender JSON
app.use(express.json());

// Inicializa o banco de dados antes de tudo
setupDatabase();

const PORT = 3000;

app.get('/', (req, resposta) => {  
  resposta.send('Olá! Minha primeira API de Piadas está viva!');
})

// Usa as rotas de piadas com o prefixo '/api'
app.use('/api', piadaRoutes);

app.use('/api', authRoutes);

app.listen(PORT, () => {
    console.log(`Servidor online na porta http://localhost:${PORT}/`);
});
