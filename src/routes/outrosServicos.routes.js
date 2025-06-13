const express = require('express');
const router = express.Router();
const { criarContato, listarContatos, deletarContato } = require('../controllers/OutrosServicosController');

router.post('/', criarContato);
router.get('/', listarContatos)
router.delete('/:id', deletarContato);

module.exports = router;
