const express = require("express");
const router = express.Router();
const ProfissionalController = require("../controllers/ProfissionalController");

router.post("/", ProfissionalController.criar);
router.get("/", ProfissionalController.listarTodos);
router.get("/:id", ProfissionalController.buscarPorId);
router.put("/:id", ProfissionalController.atualizar);
router.delete("/:id", ProfissionalController.deletar);

module.exports = router;
