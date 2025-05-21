const prisma = require('../config/prisma');

class EnderecoService {
  async criar(data) {
    return prisma.endereco.create({
      data,
    });
  }

  async listarPorCliente(clienteId) {
    return prisma.endereco.findMany({
      where: {
        clienteId,
      },
    });
  }

  async buscarPorId(id) {
    return prisma.endereco.findUnique({
      where: { id },
    });
  }

  async atualizar(id, data) {
    return prisma.endereco.update({
      where: { id },
      data,
    });
  }

  async deletar(id) {
    return prisma.endereco.delete({
      where: { id },
    });
  }
}

module.exports = new EnderecoService();
