const express = require('express');
const router = express.Router();
const OrcamentoController = require('../controllers/OrcamentoController');

router.post('/', OrcamentoController.criar);
router.get('/', OrcamentoController.listarTodos);
router.get('/:id', OrcamentoController.buscarPorId);
router.put('/:id', OrcamentoController.atualizar);
router.delete('/:id', OrcamentoController.deletar);

module.exports = router;
