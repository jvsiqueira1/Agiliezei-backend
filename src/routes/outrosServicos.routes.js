const express = require('express');
const router = express.Router();
const { criarContato } = require('../controllers/OutrosServicosController');

router.post('/', criarContato);

module.exports = router;
