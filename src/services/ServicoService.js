const prisma = require("../config/prisma");

class ServicoService {
  async criar(data) {
    console.log("criar-service-back:", data);

    const cliente = await prisma.cliente.findUnique({
      where: { telefone: data.telefone.replace(/\D/g, "") },
    });

    // Validar campos específicos baseado no tipo de serviço
    const tipoServico = await prisma.tipoServico.findUnique({
      where: { nome: data.servico },
    });

    if (!tipoServico) {
      throw new Error("Tipo de serviço não encontrado");
    }

    // Criar objeto de serviço para o Prisma
    const servicoData = {
      descricao: data.descricao,
      tipoServicoId: tipoServico.id,
      status: "PENDENTE",
      dataAgendada: data.dataAgendada ? new Date(data.dataAgendada) : null,
      clienteId: cliente.id,
      telefone: data.telefone,
      nome: data.nome,
      email: data.email,
      cep: data.cep,
      logradouro: data.logradouro,
      complemento: data.complemento,
      numero: data.numero,
      bairro: data.bairro,
      cidade: data.cidade,
      estado: data.estado,
      foto: data.foto || null,
    };

    // Adicionar campos específicos baseado no tipo de serviço
    switch (tipoServico.nome) {
      case "Eletricista":
        servicoData.tipoServicoEletrico = data.tipoServicoEletrico;
        servicoData.descricaoProblema = data.descricaoProblema;
        break;
      case "Faxineira":
        servicoData.tamanhoImovel = data.tamanhoImovel;
        servicoData.tipoLimpeza = data.tipoLimpeza;
        servicoData.frequencia = data.frequencia;
        servicoData.horario = data.horario;
        servicoData.extras = data.extras;
        break;
      case "Pintor":
        servicoData.tipoImovel = data.tipoImovel;
        servicoData.superficie = data.superficie;
        servicoData.condicao = data.condicao;
        servicoData.prazo = data.prazo;
        break;
      case "Montador de Móveis":
        servicoData.descricaoMoveis = data.descricaoMoveis;
        servicoData.quantidadeMoveis = data.quantidadeMoveis;
        break;
      case "Pedreiro":
        servicoData.descricaoServicoPedreiro = data.descricaoServicoPedreiro;
        servicoData.areaMetragem = data.areaMetragem;
        break;
      case "Freteiro":
        servicoData.descricaoItens = data.descricaoItens;
        servicoData.origemDestino = data.origemDestino;
        break;
    }

    // Validar campos obrigatórios
    const camposObrigatorios = [
      "telefone",
      "nome",
      "email",
      "cep",
      "logradouro",
      "dataAgendada",
      "numero",
      "bairro",
      "cidade",
      "estado",
    ];

    for (const campo of camposObrigatorios) {
      if (!servicoData[campo]) {
        throw new Error(`Campo ${campo} é obrigatório`);
      }
    }

    // Criar o serviço no banco de dados
    return prisma.servico.create({
      data: servicoData,
      include: {
        cliente: true,
        tipoServico: true,
      },
    });
  }

  async listarTodos() {
    return prisma.servico.findMany({
      include: {
        cliente: true,
        profissional: true,
        orcamentos: true,
      },
    });
  }

  async buscarPorId(id) {
    return prisma.servico.findUnique({
      where: { id },
      include: {
        cliente: {
          include: {
            enderecos: true,
          },
        },
        profissional: true,
        orcamentos: true,
        orcamentoEscolhido: true,
      },
    });
  }

  async listarPorCliente(clienteId) {
    return prisma.servico.findMany({
      where: {
        clienteId,
      },
      include: {
        orcamentos: true,
        profissional: true,
      },
    });
  }

  async listarPorProfissional(profissionalId) {
    return prisma.servico.findMany({
      where: {
        profissionalId,
      },
      include: {
        cliente: true,
        orcamentos: true,
      },
    });
  }

  async listarPorTipoServico(tipoServico) {
    return prisma.servico.findMany({
      where: {
        tipoServico,
      },
      include: {
        cliente: true,
      },
    });
  }

  async atualizar(id, data) {
    return prisma.servico.update({
      where: { id },
      data,
    });
  }

  async atualizarStatus(id, status) {
    return prisma.servico.update({
      where: { id },
      data: { status },
    });
  }

  async listarOrcamentos(servicoId) {
    return prisma.orcamento.findMany({
      where: {
        servicoId: servicoId,
      },
      include: {
        profissional: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            tipoServico: true,
          },
        },
      },
      take: 3, // Limita a 3 orçamentos
    });
  }

  async escolherOrcamento(servicoId, orcamentoId) {
    const orcamento = await prisma.orcamento.findUnique({
      where: { id: orcamentoId },
      include: { profissional: true },
    });

    if (!orcamento) {
      throw new Error("Orçamento não encontrado");
    }

    // Atualiza o serviço com o orçamento escolhido e o profissional
    const servicoAtualizado = await prisma.servico.update({
      where: { id: servicoId },
      data: {
        status: "AGENDADO",
        orcamentoEscolhidoId: orcamentoId,
        profissionalId: orcamento.profissionalId,
      },
      include: {
        orcamentoEscolhido: true,
        profissional: true,
        cliente: {
          include: {
            enderecos: true,
          },
        },
      },
    });

    // Atualiza o status do orçamento escolhido para APROVADO
    await prisma.orcamento.update({
      where: { id: orcamentoId },
      data: { status: "APROVADO" },
    });

    // Atualiza os outros orçamentos para REJEITADO
    await prisma.orcamento.updateMany({
      where: {
        servicoId: servicoId,
        id: { not: orcamentoId },
      },
      data: { status: "REJEITADO" },
    });

    return servicoAtualizado;
  }

  async deletar(id) {
    return prisma.servico.delete({
      where: { id },
    });
  }
}

module.exports = new ServicoService();
