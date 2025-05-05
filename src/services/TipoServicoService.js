const prisma = require("../config/prisma");

class TipoServicoService {
  async criar(data) {
    console.log("Criar Tipo de Serviço", data)
    return prisma.tipoServico.create({
      data,
    });
  }

  async listarTodos() {
    return prisma.tipoServico.findMany({
      where: {
        //active: true,
      },
      include: {
        _count: {
          select: {
            servicos: true,
            profissionais: true,
          },
        },
      },
    });
  }

  async buscarPorId(id) {
    return prisma.tipoServico.findUnique({
      where: {
        id,
        active: true,
      },
      include: {
        servicos: true,
        profissionais: true,
      },
    });
  }

  async atualizar(id, data) {
    return prisma.tipoServico.update({
      where: { id },
      data,
    });
  }

  async deletar(id) {
    return prisma.tipoServico.delete({
      where: { id },
      data: {
        active: false,
      },
    });
  }
}

module.exports = new TipoServicoService();
