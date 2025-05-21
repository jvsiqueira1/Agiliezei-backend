const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const authMiddleware = require('../middlewares/authMiddleware');
const checkUserTypeMiddleware = require('../middlewares/checkUserTypeMiddleware');

router.post('/login', AdminController.login);

router.post(
  '/',
  authMiddleware,
  checkUserTypeMiddleware(['admin']),
  AdminController.criar,
);
router.get(
  '/',
  authMiddleware,
  checkUserTypeMiddleware(['admin']),
  AdminController.listarTodos,
);
router.get(
  '/:id',
  authMiddleware,
  checkUserTypeMiddleware(['admin']),
  AdminController.buscarPorId,
);
router.put(
  '/:id',
  authMiddleware,
  checkUserTypeMiddleware(['admin']),
  AdminController.atualizar,
);
router.delete(
  '/:id',
  authMiddleware,
  checkUserTypeMiddleware(['admin']),
  AdminController.deletar,
);

module.exports = router;
