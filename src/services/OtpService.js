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
    console.log(`Telefone ${telefone}, codigo ${codigo}`);
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
    });

    let tiposDePerfil = [];
    let usuarioPrincipal = null; // Para o token inicial, podemos pegar o primeiro que aparecer

    if (clientes.length > 0) {
      tiposDePerfil.push('cliente');
      if (!usuarioPrincipal) usuarioPrincipal = clientes[0]; // Define o primeiro cliente como principal, se não houver
    }
    if (profissionais.length > 0) {
      tiposDePerfil.push('parceiro');
      if (!usuarioPrincipal) usuarioPrincipal = profissionais[0]; // Define o primeiro profissional como principal, se não houver
    }

    if (!usuarioPrincipal) {
      throw new Error('Usuário não encontrado para este telefone');
    }

    // Gerar token JWT
    const token = tokenService.gerarToken({
      id: usuarioPrincipal.id,
      telefone: usuarioPrincipal.telefone,
      tipos: tiposDePerfil, 
    });

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
        tipos: tiposDePerfil,
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
