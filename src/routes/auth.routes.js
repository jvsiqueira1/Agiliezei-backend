const express = require("express")
const router = express.Router()
const AuthController = require("../controllers/AuthController")

router.post("/enviar-otp", AuthController.enviarOtp)
router.post("/verificar-otp", AuthController.verificarOtp)

module.exports = router
