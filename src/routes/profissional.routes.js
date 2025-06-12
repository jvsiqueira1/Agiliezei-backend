const express = require('express');
const router = express.Router();
const ProfissionalController = require('../controllers/ProfissionalController');
const upload = require('../helpers/upload');

router.post('/', upload.single('foto_documento'), ProfissionalController.criar);
router.get('/', ProfissionalController.listarTodos);
router.get('/:id', ProfissionalController.buscarPorId);
router.get('/telefone/:telefone', ProfissionalController.buscarPorTelefone);
router.get('/:id/servicos', ProfissionalController.listarServicos);
router.put('/:id', ProfissionalController.atualizar);
router.delete('/:id', ProfissionalController.deletar);

module.exports = router;
