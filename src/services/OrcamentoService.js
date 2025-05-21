const prisma = require('../config/prisma');
const WhatsappClient = require('../helpers/WhatsappClient');

class OrcamentoService {
  async criar(data) {
    if (data) {
      const orcamentoExistente = await prisma.orcamento.findFirst({
        where: {
          servicoId: data.servicoId,
          profissionalId: data.profissionalId,
        },
      });

      if (orcamentoExistente) {
        throw new Error(
          'Já existe um orçamento pendente para este serviço e profissional.',
        );
      }
    }

    const orcamento = await prisma.orcamento.create({
      data: {
        valor: data.valor ?? null,
        descricao: data.descricao,
        status: data.status,
        servico: {
          connect: { id: data.servicoId },
        },
        profissional: {
          connect: { id: data.profissionalId },
        },
        precisaVisitaTecnica: data.precisaVisitaTecnica ?? false,
        dataVisitaTecnica: data.dataVisitaTecnica
          ? new Date(data.dataVisitaTecnica)
          : null,
      },
      include: {
        servico: {
          include: {
            cliente: true,
          },
        },
        profissional: true,
      },
    });

    let mensagemCliente = `Olá, ${orcamento.servico.cliente.nome}!\nUm orçamento para o serviço de "${orcamento.servico.descricao || orcamento.servico.descricaoServicoPedreiro || orcamento.servico.descricaoProblema}" foi criado.`;

    if (orcamento.precisaVisitaTecnica) {
      mensagemCliente += `\n⚠️ Atenção: este orçamento requer visita técnica. Por favor, confirme se esta está de acordo.`;
    }

    mensagemCliente += `\nVerifique os detalhes em agilizei.net`;

    await WhatsappClient.enviarMensagem(
      orcamento.servico.cliente.telefone,
      mensagemCliente,
    );

    return orcamento;
  }

  async listarTodos() {
    return prisma.orcamento.findMany({
      include: {
        servico: true,
        profissional: true,
      },
    });
  }

  async buscarPorId(id) {
    return prisma.orcamento.findUnique({
      where: { id },
      include: {
        servico: true,
        profissional: true,
      },
    });
  }

  async listarPorServico(servicoId) {
    return prisma.orcamento.findMany({
      where: {
        servicoId,
      },
      include: {
        profissional: true,
      },
    });
  }

  async listarPorProfissional(profissionalId) {
    return prisma.orcamento.findMany({
      where: {
        profissionalId,
      },
      include: {
        servico: true,
      },
    });
  }

  async atualizar(id, data) {
    const { valor, descricao, status } = data;

    if (typeof valor !== 'number' || isNaN(valor)) {
      throw new Error('O valor deve ser um número válido e não pode ser nulo');
    }

    if (typeof descricao !== 'string' || descricao.trim() === '') {
      throw new Error('Descrição inválida');
    }

    if (!status || typeof status !== 'string') {
      throw new Error('Status inválido ou não informado');
    }

    return prisma.orcamento.update({
      where: { id },
      data: {
        valor,
        descricao,
        status, // Apenas atualiza com o status recebido do controller
      },
      include: {
        servico: true,
        profissional: true,
      },
    });
  }

  async atualizarStatus(id, status) {
    return prisma.orcamento.update({
      where: { id },
      data: { status },
    });
  }

  async deletar(id) {
    return prisma.orcamento.delete({
      where: { id },
    });
  }
}

module.exports = new OrcamentoService();
