const prisma = require('../config/prisma');

class ProfissionalService {
  async criar(data) {
    const documento = data.cpfCnpj?.replace(/\D/g, '');

    if (!documento) {
      throw new Error('CPF ou CNPJ é obrigatório.');
    }

    const isCnpj = documento.length === 14;
    const isCpf = documento.length === 11;

    if (!isCpf && !isCnpj) {
      throw new Error('Documento inválido. Insira um CPF ou CNPJ válido.');
    }

    if (!data.tipoServicoId) {
      throw new Error('tipoServicoId é obrigatório');
    }

    const tipoServicoId = parseInt(data.tipoServicoId, 10);

    const fotoDocumento = data.foto_documento;

    console.log('foto_documento (nome do arquivo): ', fotoDocumento);

    const profissionalData = {
      nome: data.nome,
      email: data.email,
      telefone: data.telefone,
      dataNascimento: new Date(data.dataNascimento),
      endereco: data.endereco,
      tipoServicoId: tipoServicoId,
      active: false,
      ...(isCpf ? { cpf: documento } : { cnpj: documento }),
      foto_documento: fotoDocumento,
    };

    const profissional = await prisma.profissional.create({
      data: profissionalData,
    });

    console.log('Profissional criado:', profissional);

    return profissional;
  }

  async listarTodos({ search, tipoServicoId, page = 1, limit = 10 }) {
    const where = {};

    if (search) {
      where.OR = [
        { nome: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { telefone: { contains: search } },
        { tipoServico: { nome: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (tipoServicoId) {
      where.tipoServicoId = Number(tipoServicoId);
    }

    const skip = (page - 1) * limit;
    const totalCount = await prisma.profissional.count({
      where,
    });

    const profissionais = await prisma.profissional.findMany({
      where,
      skip,
      take: limit,
      include: {
        tipoServico: true,
      },
    });

    return {
      data: profissionais,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
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

  async buscarPorTelefone(telefone) {
    return prisma.profissional.findFirst({
      where: {
        telefone,
        active: true,
      },
      include: {
        tipoServico: true,
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
