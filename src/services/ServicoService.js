const prisma = require('../config/prisma');
const upload = require('../helpers/upload');
const WhatsappClient = require('../helpers/WhatsappClient');

class ServicoService {
  async criar(data) {
    console.log('criar-service-back:', data);

    const cliente = await prisma.cliente.findUnique({
      where: { telefone: data.telefone.replace(/\D/g, '') },
    });

    const tipoServico = await prisma.tipoServico.findUnique({
      where: { nome: data.servico },
    });

    if (!tipoServico) {
      throw new Error('Tipo de serviço não encontrado');
    }

    // Criar objeto de serviço para o Prisma
    const servicoData = {
      descricao: data.descricao,
      tipoServicoId: tipoServico.id,
      status: 'PENDENTE',
      dataAgendada: data.dataAgendada
        ? new Date(data.dataAgendada.split('/').reverse().join('-'))
        : null,
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
      case 'Eletricista':
        servicoData.tipoServicoEletrico = data.tipoServicoEletrico;
        servicoData.descricaoProblema = data.descricaoProblema;
        break;
      case 'Faxineira':
        servicoData.tamanhoImovel = data.tamanhoImovel;
        servicoData.tipoLimpeza = data.tipoLimpeza;
        servicoData.frequencia = data.frequencia;
        servicoData.horario = data.horario;
        servicoData.extras = data.extras;
        break;
      case 'Pintor':
        servicoData.tipoImovel = data.tipoImovel;
        servicoData.superficie = data.superficie;
        servicoData.condicao = data.condicao;
        servicoData.prazo = data.prazo;
        break;
      case 'Montador de Móveis':
        servicoData.descricaoMoveis = data.descricaoMoveis;
        servicoData.quantidadeMoveis = parseInt(data.quantidadeMoveis, 10);
        break;
      case 'Pedreiro':
        // Adicionar apenas campos relevantes para o "Pedreiro"
        servicoData.descricaoServicoPedreiro = data.descricaoServicoPedreiro;
        servicoData.areaMetragem = data.areaMetragem;
        break;
      case 'Freteiro':
        // Adicionar apenas campos relevantes para o "Freteiro"
        servicoData.descricaoItens = data.descricaoItens;
        servicoData.origemDestino = data.origemDestino;
        break;
    }

    // Validar campos obrigatórios
    const camposObrigatorios = [
      'telefone',
      'nome',
      'email',
      'cep',
      'logradouro',
      'dataAgendada',
      'numero',
      'bairro',
      'cidade',
      'estado',
    ];

    for (const campo of camposObrigatorios) {
      if (!servicoData[campo]) {
        throw new Error(`Campo ${campo} é obrigatório`);
      }
    }

    // Criar o serviço no banco de dados
    const servico = prisma.servico.create({
      data: servicoData,
      include: {
        cliente: true,
        tipoServico: true,
      },
    });

    const profissionais = await prisma.profissional.findMany({
      where: {
        tipoServicoId: tipoServico.id,
      },
    });

    for (const profissional of profissionais) {
      const mensagem = `Olá, ${profissional.nome}!\nUm novo serviço de "${tipoServico.nome}" foi criado.\nVerifique os detalhes em agilizei.net`; 
      try {
        await WhatsappClient.enviarMensagem(profissional.telefone, mensagem);
      } catch (error) {
        console.error(
          `Erro ao enviar mensagem para ${profissional.nome} (${profissional.telefone}):`,
          error.message,
        );
      }
    }

    return servico;
  }

  async listarTodos({ page = 1, limit = 10, tipoServicoId }) {
    const skip = (page - 1) * limit;

    const where = {};
    if (tipoServicoId) {
      where.tipoServicoId = Number(tipoServicoId);
    }

    const totalCount = await prisma.servico.count({ where });

    const servicos = await prisma.servico.findMany({
      where,
      include: {
        cliente: true,
        profissional: true,
        tipoServico: true,
      },
      skip,
      take: Number(limit),
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalPages = Math.ceil(totalCount / limit);

    return {
      servicos,
      totalCount,
      totalPages,
    };
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
        tipoServico: true, // Inclui o tipo de serviço
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
        orcamentos: {
          include: {
            profissional: {
              select: {
                nome: true,
              },
            },
          },
        },
        profissional: true,
        tipoServico: true, // Inclui o tipo de serviço para uso posterior
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

  async listarPorTipoServico(tipoServicoId) {
    return prisma.servico.findMany({
      where: {
        tipoServicoId: tipoServicoId,
      },
      include: {
        cliente: true,
        orcamentos: true,
      },
    });
  }

  async atualizar(id, data) {
    const servicoAtual = await prisma.servico.findUnique({ where: { id } });

    const atualizado = await prisma.servico.update({
      where: { id },
      data,
    });
  
    if (data.status === "CANCELADO" && servicoAtual.status !== "CANCELADO") {
      // Buscar todos os profissionais do tipoServicoId do serviço atualizado
      const profissionais = await prisma.profissional.findMany({
        where: { tipoServicoId: atualizado.tipoServicoId },
      });
  
      const mensagem = `Olá! O serviço com a descrição "${atualizado.descricao || atualizado.descricaoServicoPedreiro || atualizado.descricaoProblema}" foi cancelado pelo cliente.`;
  
      for (const profissional of profissionais) {
        if (profissional.telefone) {
          try {
            await WhatsappClient.enviarMensagem(profissional.telefone, mensagem);
          } catch (err) {
            console.error(
              `Erro ao enviar mensagem para ${profissional.nome} (${profissional.telefone}):`,
              err
            );
          }
        }
      }
    }
  
    return atualizado;
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
    return await prisma.$transaction(async (prisma) => {
      const orcamento = await prisma.orcamento.findUnique({
        where: { id: orcamentoId },
        include: { profissional: true },
      });
  
      if (!orcamento) {
        throw new Error('Orçamento não encontrado');
      }
  
      // Atualiza o status do orçamento escolhido para APROVADO
      await prisma.orcamento.update({
        where: { id: orcamentoId },
        data: { status: 'APROVADO' },
      });
  
      // Atualiza os outros orçamentos para REJEITADO
      await prisma.orcamento.updateMany({
        where: {
          servicoId: servicoId,
          id: { not: orcamentoId },
        },
        data: { status: 'REJEITADO' },
      });
  
      // Atualiza o serviço com o orçamento escolhido e o profissional
      const servicoAtualizado = await prisma.servico.update({
        where: { id: servicoId },
        data: {
          status: 'AGENDADO',
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
  
      // Enviar mensagem para o profissional avisando que o serviço foi fechado
      const mensagem = `Olá ${orcamento.profissional.nome}, o serviço com a descrição "${servicoAtualizado.descricao || servicoAtualizado.descricaoServicoPedreiro || servicoAtualizado.descricaoProblema}" foi fechado e você foi escolhido para executá-lo. Por favor, verifique os detalhes no portal Agilizei.`;
  
      try {
        if (orcamento.profissional.telefone) {
          await WhatsappClient.enviarMensagem(orcamento.profissional.telefone, mensagem);
        }
      } catch (err) {
        console.error('Erro ao enviar mensagem para profissional:', err);
      }
  
      return servicoAtualizado;
    });
  }

  async confirmarVisitaParceiro(orcamentoId) {
    const orcamentoAtualizado = await prisma.orcamento.update({
      where: { id: orcamentoId },
      data: {
        status: 'VISITA_TECNICA_REALIZADA',
        visitaTecnicaRealizada: true,
        precisaVisitaTecnica: false,
      },
    });
    return orcamentoAtualizado;
  }

  async confirmarVisitaCliente(orcamentoId) {
    const orcamentoAtualizado = await prisma.orcamento.update({
      where: { id: orcamentoId },
      data: {
        status: 'VISITA_TECNICA_CONFIRMADA',
        visitaTecnicaConfirmada: true,
      },
      include: {
        profissional: true,
        servico: {
          include: {
            cliente: true,
          },
        },
      },
    });

    const nomeProfissional =
      orcamentoAtualizado.profissional?.nome || 'Parceiro';
    const telefoneProfissional = orcamentoAtualizado.profissional?.telefone;

    if (telefoneProfissional) {
      const mensagem = `Olá, ${nomeProfissional}!\nO cliente confirmou a visita técnica para o serviço. Favor preparar-se para o atendimento.`;

      try {
        await WhatsappClient.enviarMensagem(telefoneProfissional, mensagem);
      } catch (error) {
        console.error('Erro ao enviar mensagem para parceiro: ', error);
      }
    }

    return orcamentoAtualizado;
  }

  async deletar(id) {
    return prisma.servico.delete({
      where: { id },
    });
  }
}

module.exports = new ServicoService();
