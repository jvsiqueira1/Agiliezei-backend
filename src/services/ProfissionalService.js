const prisma = require("../config/prisma");

class ProfissionalService {
  async criar(data) {
    return prisma.profissional.create({
      data,
    });
  }

  async listarTodos() {
    return prisma.profissional.findMany();
  }

  async buscarPorId(id) {
    return prisma.profissional.findUnique({
      where: {
        id,
        active: true,
      },
      include: {
        servicos: true,
        orcamentos: true,
      },
    });
  }

  async listarPorTipoServico(tipoServico) {
    return prisma.profissional.findMany({
      where: {
        tipoServico,
        active: true,
      },
    });
  }

  async atualizar(id, data) {
    return prisma.profissional.update({
      where: { id },
      data,
    });
  }

  async deletar(id) {
    return prisma.profissional.update({
      where: { id },
      data: {
        active: false,
      },
    });
  }
}

module.exports = new ProfissionalService();
