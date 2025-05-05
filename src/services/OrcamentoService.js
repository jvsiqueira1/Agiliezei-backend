const prisma = require("../config/prisma");

class OrcamentoService {
  async criar(data) {
    return prisma.orcamento.create({
      data,
      include: {
        servico: true,
        profissional: true,
      },
    });
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
    return prisma.orcamento.update({
      where: { id },
      data,
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
