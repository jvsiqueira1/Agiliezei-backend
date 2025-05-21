const express = require('express');
const router = express.Router();
const ServicoController = require('../controllers/ServicoController');
const upload = require('../helpers/upload');

router.post('/', upload.single('foto'), ServicoController.criar);
router.get('/', ServicoController.listarTodos);
router.get('/cliente/:id', ServicoController.listarPorCliente);
router.get('/profissional/:id', ServicoController.listarPorProfissional);
router.get('/:id', ServicoController.buscarPorId);
router.put('/:id', ServicoController.atualizar);
router.put('/:id/escolher-orcamento', ServicoController.escolherOrcamento);
router.delete('/:id', ServicoController.deletar);
router.get('/:servicoId/orcamentos', ServicoController.listarOrcamentos);
router.get(
  '/tipo-servico/:tipoServicoId',
  ServicoController.listarPorTipoServico,
);
router.put(
  '/:id/confirmar-visita-cliente',
  ServicoController.confirmarVisitaCliente,
);
router.put(
  '/:id/confirmar-visita-parceiro',
  ServicoController.confirmarVisitaParceiro,
);

module.exports = router;
