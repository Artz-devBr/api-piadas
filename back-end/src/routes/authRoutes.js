import { Router } from 'express';
import { registrarUsuario } from '../controllers/authController.js';

const router = Router();

router.post('/usuarios', registrarUsuario);

export default router;
