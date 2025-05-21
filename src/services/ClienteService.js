const prisma = require('../config/prisma');

class ClienteService {
  async criar(data) {
    const cliente = await this.buscarPorTelefone(data.telefone);
    if (cliente) {
      throw new Error('Cliente já cadastrado');
    }
    console.log('data criar cliente:', data);
    return prisma.cliente.create({
      data,
    });
  }

  async listarTodos({ page = 1, limit = 10, search = '' }) {
    const skip = (page - 1) * limit;
    const take = limit;
    const where = search
      ? {
          OR: [
            { nome: { contains: search, mode: 'insensitive' } },
            { telefone: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const totalCount = await prisma.cliente.count({ where });

    const data = await prisma.cliente.findMany({
      where,
      skip,
      take,
      include: {
        enderecos: true,
        servicos: true,
      },
    });

    const totalPages = Math.ceil(totalCount / limit);

    return { data, totalCount, totalPages };
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
    const { servicos, enderecos, ...clienteData } = data;

    try {
      return await prisma.$transaction(async (tx) => {
        if (servicos && Array.isArray(servicos)) {
          await Promise.all(
            servicos.map(async (servico) => {
              const dadosServico = {
                logradouro: servico.logradouro,
                numero: servico.numero,
                complemento: servico.complemento,
                bairro: servico.bairro,
                cidade: servico.cidade,
                estado: servico.estado,
                cep: servico.cep,
                descricao: servico.descricao,
                descricaoProblema: servico.descricaoProblema,
                descricaoServicoPedreiro: servico.descricaoServicoPedreiro,
                dataAgendada: servico.dataAgendada
                  ? new Date(servico.dataAgendada)
                  : null,
              };

              if (servico.id) {
                await tx.servico.update({
                  where: { id: servico.id },
                  data: dadosServico,
                });
              } else {
                await tx.servico.create({
                  data: {
                    ...dadosServico,
                    clienteId: id,
                  },
                });
              }
            }),
          );
        }

        const clienteAtualizado = await tx.cliente.update({
          where: { id },
          data: clienteData,
          include: { servicos: true },
        });

        return clienteAtualizado;
      });
    } catch (error) {
      console.error('Erro ao atualizar cliente e serviços:', error);
      throw error;
    }
  }

  async deletar(id) {
    return prisma.cliente.delete({
      where: { id },
    });
  }
}

module.exports = new ClienteService();
