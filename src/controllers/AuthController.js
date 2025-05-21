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
      const { telefone, tipo } = req.body;

      if (!telefone || !tipo) {
        return res
          .status(400)
          .json({ error: 'Telefone e tipo são obrigatórios' });
      }

      await OtpService.enviarOtp(telefone, tipo);
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

      if (!resultado) {
        return res.status(401).json({ error: 'Código inválido ou expirado' });
      }

      const cliente = await prisma.cliente.findUnique({ where: { telefone } });
      const parceiro = await prisma.profissional.findUnique({
        where: { telefone },
        select: {
          id: true,
          nome: true,
          telefone: true,
          tipoServicoId: true,
        },
      });

      const usuario = cliente || parceiro;

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      const role = cliente ? 'client' : 'partner';

      const tokenPayload = {
        id: usuario.id,
        telefone: usuario.telefone,
        role,
      };

      if (role === 'partner') {
        tokenPayload.tipoServicoId = usuario.tipoServicoId;
      }

      const token = TokenService.gerarToken(tokenPayload);

      return res.status(200).json({
        sucesso: true,
        token,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          telefone: usuario.telefone,
          role,
          ...(role === 'partner' && { tipoServicoId: usuario.tipoServicoId }),
        },
      });
    } catch (error) {
      console.error('Erro ao verificar OTP:', error);
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new AuthController();
