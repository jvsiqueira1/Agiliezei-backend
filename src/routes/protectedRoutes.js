const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const checkUserTypeMiddleware = require('../middlewares/checkUserTypeMiddleware');

// Rota protegida que requer apenas autenticação
router.get('/perfil', authMiddleware, (req, res) => {
  res.json({
    message: 'Rota protegida acessada com sucesso',
    usuario: req.usuario,
  });
});

// Rota protegida que requer autenticação e tipo de usuário específico
router.get(
  '/admin',
  authMiddleware,
  checkUserTypeMiddleware(['admin']),
  (req, res) => {
    res.json({
      message: 'Rota admin acessada com sucesso',
      usuario: req.usuario,
    });
  },
);

// Rota protegida que requer autenticação e múltiplos tipos de usuário
router.get(
  '/dashboard',
  authMiddleware,
  checkUserTypeMiddleware(['cliente', 'parceiro']),
  (req, res) => {
    res.json({
      message: 'Rota dashboard acessada com sucesso',
      usuario: req.usuario,
    });
  },
);

module.exports = router;
