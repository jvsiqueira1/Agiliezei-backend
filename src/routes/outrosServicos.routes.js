const express = require('express');
const router = express.Router();
const { criarContato, listarContatos } = require('../controllers/OutrosServicosController');

router.post('/', criarContato);
router.get('/', listarContatos)

module.exports = router;
