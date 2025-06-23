const prisma = require('../config/prisma');
const { formatarTelefone } = require('../helpers/Utils');
const whatsappClient = require('../helpers/WhatsappClient');
const tokenService = require('./TokenService');

class OtpService {
  gerarCodigo() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async enviarOtp(telefone) {
    const codigo = this.gerarCodigo();
    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    // Salvar o código no banco de dados
    await prisma.otp.create({
      data: {
        telefone,
        codigo,
        expires,
      },
    });

    // Enviar mensagem via WhatsApp
    const mensagem = `🔐 Seu código de verificação Agilizei é: *${codigo}*`;
    await whatsappClient.enviarMensagem(telefone, mensagem);

    return { sucesso: true };
  }

  async verificarOtp(telefone, codigo) {
    const otp = await prisma.otp.findFirst({
      where: {
        telefone,
        codigo,
        expires: {
          gt: new Date(),
        },
      },
    });
    if (!otp) {
      throw new Error('Código inválido ou expirado');
    }

    const clientes = await prisma.cliente.findMany({
      where: { telefone },
    });

    const profissionais = await prisma.profissional.findMany({
      where: { telefone },
      select: {
        id: true,
        telefone: true,
        tipoServicoId: true, // Incluindo o tipo de serviço para o profissional
      }
    });

    let tiposDePerfil = [];
    let usuarioPrincipal = null; // Para o token inicial, podemos pegar o primeiro que aparecer
    let payloadDoToken = {}

    if (clientes.length > 0) {
      tiposDePerfil.push('cliente');
      if (!usuarioPrincipal) {
        usuarioPrincipal = clientes[0];
        payloadDoToken = {
          id: usuarioPrincipal.id,
          telefone: usuarioPrincipal.telefone,
          nome: usuarioPrincipal.nome,
        }
      }
    }
    if (profissionais.length > 0) {
      tiposDePerfil.push('parceiro');
      if (!usuarioPrincipal) {
        usuarioPrincipal = profissionais[0];
        payloadDoToken = {
          id: usuarioPrincipal.id,
          telefone: usuarioPrincipal.telefone,
          tipoServicoId: usuarioPrincipal.tipoServicoId,
        }
      } else if (tiposDePerfil.includes('parceiro') && profissionais[0].tipoServicoId) {
         payloadDoToken.tipoServicoId = profissionais[0].tipoServicoId;
      }
    }

    if (!usuarioPrincipal) {
      throw new Error('Usuário não encontrado para este telefone');
    }

    payloadDoToken.tipos = tiposDePerfil;

    // Gerar token JWT
    const token = tokenService.gerarToken(payloadDoToken);

    // Deletar o código OTP após uso
    await prisma.otp.delete({
      where: {
        id: otp.id,
      },
    });

    return {
      token,
      usuario: {
        id: usuarioPrincipal.id,
        telefone: usuarioPrincipal.telefone,
        nome: usuarioPrincipal.nome || null,
        tipos: tiposDePerfil,
        tipoServicoId: usuarioPrincipal.tipoServicoId || null,
      },
    };
  }

  async verificarOtpGenerico(telefone, codigo) {
    const otp = await prisma.otp.findFirst({
      where: {
        telefone,
        codigo,
        expires: {
          gt: new Date()
        }
      }
    })

    if(!otp) {
      throw new Error('Código inválido ou expirado')
    }

    await prisma.otp.delete({
      where: {
        id: otp.id
      }
    })

    return {
      sucesso: true,
      mensagem: 'Código verificado com sucesso'
    }
  }
}

module.exports = new OtpService();
