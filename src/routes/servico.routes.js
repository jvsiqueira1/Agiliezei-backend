const express = require("express");
const router = express.Router();
const ServicoController = require("../controllers/ServicoController");

router.post("/", ServicoController.criar);
router.get("/", ServicoController.listarTodos);
router.get("/:id", ServicoController.buscarPorId);
router.get("/cliente/:id", ServicoController.listarPorCliente);
router.get("/profissional/:id", ServicoController.listarPorProfissional);
router.put("/:id", ServicoController.atualizar);
router.put("/:id/escolher-orcamento", ServicoController.escolherOrcamento);
router.delete("/:id", ServicoController.deletar);
router.get("/:servicoId/orcamentos", ServicoController.listarOrcamentos);

module.exports = router;
