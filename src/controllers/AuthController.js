const https = require('https');
const { URL } = require('url');
const prisma = require('../config/prisma');
const { formatarTelefone } = require('../helpers/Utils');
const OtpService = require('../services/OtpService');
const TokenService = require('../services/TokenService');

// Gerar código de verificação
const gerarCodigo = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Enviar código de verificação
class AuthController {
  async enviarOtp(req, res) {
    try {
      const { telefone } = req.body;
      if (!telefone) {
        return res
          .status(400)
          .json({ error: 'Telefone é obrigatório' });
      }

      await OtpService.enviarOtp(telefone); 
      res.json({ sucesso: true, message: 'Código OTP enviado com sucesso' });
    } catch (error) {
      console.error('Erro ao enviar OTP:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async verificarOtp(req, res) {
    try {
      const { telefone, codigo } = req.body;

      if (!telefone || !codigo) {
        return res
          .status(400)
          .json({ error: 'Telefone e código são obrigatórios' });
      }

      const resultado = await OtpService.verificarOtp(telefone, codigo);

      if (!resultado || !resultado.usuario || !resultado.usuario.tipos || resultado.usuario.tipos.length === 0) {
        return res.status(401).json({ error: 'Código inválido, expirado ou usuário não encontrado' });
      }

      const { token, usuario } = resultado;

      const roles = usuario.tipos; 

      const rolePrincipal = roles.includes('parceiro') ? 'partner' : 'client'; 

      return res.status(200).json({
        sucesso: true,
        token, 
        usuario: {
          id: usuario.id,
          telefone: usuario.telefone,
          tipos: usuario.tipos,
          role: rolePrincipal,
          tipoServicoId: usuario.tipoServicoId || null,
          nome: usuario.nome,
          ...(roles.includes('parceiro') && usuario.tipoServicoId && { tipoServicoId: usuario.tipoServicoId }),
        },
      });
    } catch (error) {
      console.error('Erro ao verificar OTP:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async verificarTelefoneGenerico(req, res) {
    try {
      const { telefone, codigo } = req.body;

      if (!telefone || !codigo) {
        return res
          .status(400)
          .json({ error: 'Telefone e código são obrigatórios' });
      }

      const resultado = await OtpService.verificarOtpGenerico(telefone, codigo);
      return res.status(200).json(resultado);
    } catch (error) {
      console.error('Erro ao verificar telefone:', error);
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new AuthController();