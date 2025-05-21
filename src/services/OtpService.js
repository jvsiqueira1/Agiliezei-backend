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

    console.log('Teste OTP:', otp);

    if (!otp) {
      throw new Error('Código inválido ou expirado');
    }

    // Buscar o usuário pelo telefone
    let usuario = await prisma.cliente.findFirst({
      where: { telefone },
    });

    let tipo = 'cliente';

    if (!usuario) {
      usuario = await prisma.profissional.findFirst({
        where: { telefone },
      });
      tipo = 'parceiro';
    }

    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    // Gerar token JWT
    const token = tokenService.gerarToken({
      id: usuario.id,
      telefone: usuario.telefone,
      tipo,
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
        id: usuario.id,
        telefone: usuario.telefone,
        tipo: usuario.tipo,
      },
    };
  }
}

module.exports = new OtpService();
