import { Router } from 'express';
import {
    criarPiada, buscarPiadaAleatoria,
    listarPiadasPendentes, aprovarPiada,
    buscarDezPiadasAleatorias, deletarPiada
} from '../controllers/piadaController.js';
// 1. Importe o middleware
import authMiddleware from '../middlewares/authMiddleware.js';


const router = Router();

// Rotas Públicas
// Define que, ao fazer um POST em '/piadas', executa a função 'criarPiada'
router.post('/piadas', criarPiada);
// Rota nova: GET /piadas
router.get('/piadas', buscarPiadaAleatoria);

router.get('/dezpiadas', buscarDezPiadasAleatorias);

// Rotas de Admin (Por enquanto abertas)
router.get('/piadas/pendentes', authMiddleware, listarPiadasPendentes);
router.put('/piadas/:id/aprovar', authMiddleware, aprovarPiada); // PUT indica atualização
router.delete('/piadas/:id', authMiddleware, deletarPiada); // DELETE indica remoção

export default router;
