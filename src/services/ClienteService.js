const prisma = require("../config/prisma");

class ClienteService {
  async criar(data) {
    const cliente = await this.buscarPorTelefone(data.telefone);
    if (cliente) {
      throw new Error("Cliente já cadastrado");
    }
    console.log("data criar cliente:", data);
    return prisma.cliente.create({
      data,
    });
  }

  async listarTodos() {
    return prisma.cliente.findMany({
      include: {
        enderecos: true,
        servicos: true,
      },
    });
  }

  async buscarPorId(id) {
    return prisma.cliente.findUnique({
      where: { id },
      include: {
        enderecos: true,
        servicos: true,
      },
    });
  }

  async buscarPorTelefone(telefone) {
    return prisma.cliente.findUnique({
      where: { telefone },
      include: {
        enderecos: true,
        servicos: true,
      },
    });
  }

  async atualizar(id, data) {
    const { enderecos, ...clienteData } = data;

    if (enderecos) {
      // Busca os endereços existentes do cliente
      const enderecosAtuais = await prisma.endereco.findMany({
        where: { clienteId: id },
      });

      // Se existem endereços, atualiza o primeiro. Se não, cria um novo
      if (enderecosAtuais.length > 0) {
        await prisma.endereco.update({
          where: { id: enderecosAtuais[0].id },
          data: enderecos,
        });
      } else {
        await prisma.endereco.create({
          data: {
            ...enderecos,
            clienteId: id,
          },
        });
      }
    }

    // Atualiza os dados do cliente
    return prisma.cliente.update({
      where: { id },
      data: clienteData,
      include: {
        enderecos: true,
      },
    });
  }

  async deletar(id) {
    return prisma.cliente.delete({
      where: { id },
    });
  }
}

module.exports = new ClienteService();
