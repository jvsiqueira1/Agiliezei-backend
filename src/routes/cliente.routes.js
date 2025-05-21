const express = require('express');
const router = express.Router();
const ClienteController = require('../controllers/ClienteController');

router.post('/', ClienteController.criar);
router.get('/', ClienteController.listarTodos);
router.get('/:id', ClienteController.buscarPorId);
router.get('/telefone/:telefone', ClienteController.buscarPorTelefone);
router.put('/:id', ClienteController.atualizar);
router.delete('/:id', ClienteController.deletar);

module.exports = router;
