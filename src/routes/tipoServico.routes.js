const express = require("express");
const router = express.Router();
const TipoServicoController = require("../controllers/TipoServicoController");

router.post("/", TipoServicoController.criar);
router.get("/", TipoServicoController.listarTodos);
router.get("/:id", TipoServicoController.buscarPorId);
router.put("/:id", TipoServicoController.atualizar);
router.delete("/:id", TipoServicoController.deletar);

module.exports = router;
