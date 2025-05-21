const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function criarContato(req, res) {
  const { telefone, tipoServico, descricao } = req.body;

  if (!telefone || !tipoServico || !descricao) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  try {
    const novoContato = await prisma.contatoOutrosServicos.create({
      data: { telefone, tipoServico, descricao },
    });

    return res.status(201).json({ success: true, data: novoContato });
  } catch (err) {
    console.error('Erro ao salvar contato:', err);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
}

module.exports = { criarContato };
