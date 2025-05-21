const prisma = require('../config/prisma');
const OrcamentoService = require('../services/OrcamentoService');

function determinarNovoStatus(data) {
  if (data.precisaVisitaTecnica) {
    return 'AGUARDANDO_VISITA_TECNICA';
  }
  return 'AGUARDANDO_ESCOLHA_ORCAMENTO';
}

class OrcamentoController {
  async criar(req, res) {
    try {
      const data = req.body;

      data.status = determinarNovoStatus(data);

      const orcamento = await OrcamentoService.criar(data);
      return res.status(201).json(orcamento);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async listarTodos(req, res) {
    try {
      const orcamentos = await OrcamentoService.listarTodos();
      res.json(orcamentos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async buscarPorId(req, res) {
    try {
      const id = parseInt(req.params.id);
      const orcamento = await OrcamentoService.buscarPorId(id);

      if (!orcamento) {
        return res.status(404).json({ error: 'Orçamento não encontrado' });
      }

      res.json(orcamento);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async listarPorServico(req, res) {
    try {
      const servicoId = parseInt(req.params.servicoId);
      const orcamentos = await OrcamentoService.listarPorServico(servicoId);
      res.json(orcamentos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async listarPorProfissional(req, res) {
    try {
      const profissionalId = parseInt(req.params.profissionalId);
      const orcamentos =
        await OrcamentoService.listarPorProfissional(profissionalId);
      res.json(orcamentos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async atualizar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { valor, descricao } = req.body;

      if (typeof valor !== 'number' || isNaN(valor)) {
        return res
          .status(400)
          .json({
            error: 'O valor deve ser um número válido e não pode ser nulo.',
          });
      }

      if (typeof descricao !== 'string' || descricao.trim() === '') {
        return res.status(400).json({ error: 'Descrição inválida.' });
      }

      const orcamentoAtual = await OrcamentoService.buscarPorId(id);
      if (!orcamentoAtual) {
        return res.status(404).json({ error: 'Orçamento não encontrado.' });
      }

      // Decide o novo status aqui, e passa para o service
      const novoStatus = determinarNovoStatus(orcamentoAtual);

      const orcamentoAtualizado = await OrcamentoService.atualizar(id, {
        valor,
        descricao,
        status: novoStatus,
      });

      return res.json(orcamentoAtualizado);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async atualizarStatus(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const orcamento = await OrcamentoService.atualizarStatus(id, status);
      res.json(orcamento);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deletar(req, res) {
    try {
      const id = parseInt(req.params.id);
      await OrcamentoService.deletar(id);
      return res
        .status(200)
        .json(ApiOutputs.success('Cliente deletado com sucesso'));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new OrcamentoController();
