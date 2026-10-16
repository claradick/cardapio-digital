import { Router } from 'express';
import {
  listarMassas,
  buscarMassaPorId,
  criarMassa,
  atualizarMassa,
  excluirMassa,
} from '../controllers/massasController.js';

const router = Router();

router.get('/massas', listarMassas);          // lista todas
router.get('/massas/:id', buscarMassaPorId);  // busca uma
router.post('/massas', criarMassa);           // cria
router.put('/massas/:id', atualizarMassa);    // atualiza
router.delete('/massas/:id', excluirMassa);   // exclui

export default router;