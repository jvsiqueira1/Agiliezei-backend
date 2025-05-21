const ServicoService = require('../services/ServicoService');
const ApiOutputs = require('../helpers/ApiOutputs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const filtrarCamposPorTipoServico = require('../helpers/FiltrarCamposPorTipoServico');

class ServicoController {
  async criar(req, res) {
    try {
      let foto = null;
      if (req.file) {
        foto = `${req.file.filename}`;
      }

      const dadosServico = {
        ...req.body,
        foto,
      };

      const servico = await ServicoService.criar(dadosServico);
      res.status(201).json(servico);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  async listarTodos(req, res) {
    try {
      const { page = 1, limit = 10, tipoServicoId } = req.query;
      const result = await ServicoService.listarTodos({
        page,
        limit,
        tipoServicoId,
      });
      return res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async buscarPorId(req, res) {
    try {
      const id = Number(req.params.id);
      const servico = await ServicoService.buscarPorId(id);

      if (!servico) {
        return res.status(404).json({ error: 'Serviço não encontrado' });
      }

      res.json(servico);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async listarPorCliente(req, res) {
    try {
      const clienteId = Number(req.params.id);
      const servicos = await ServicoService.listarPorCliente(clienteId);

      const servicosFiltrados = servicos.map(filtrarCamposPorTipoServico);
      res.json(servicosFiltrados);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async listarPorProfissional(req, res) {
    try {
      const profissionalId = Number(req.params.id);
      const servicos =
        await ServicoService.listarPorProfissional(profissionalId);
      res.json(servicos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async listarOrcamentos(req, res) {
    try {
      const servicoId = Number(req.params.servicoId);
      const orcamentos = await ServicoService.listarOrcamentos(servicoId);
      return res.json(
        ApiOutputs.success(orcamentos, 'Orçamentos listados com sucesso'),
      );
    } catch (error) {
      console.error(error);
      return res.status(500).json(ApiOutputs.error(error.message));
    }
  }

  async escolherOrcamento(req, res) {
    try {
      const servicoId = Number(req.params.id);
      const { orcamentoId } = req.body;

      const servico = await ServicoService.escolherOrcamento(
        servicoId,
        Number(orcamentoId),
      );
      return res.json(
        ApiOutputs.success(servico, 'Orçamento escolhido com sucesso'),
      );
    } catch (error) {
      console.error(error);
      return res.status(400).json(ApiOutputs.badRequest(error.message));
    }
  }

  async atualizar(req, res) {
    try {
      const id = Number(req.params.id);
      const servico = await ServicoService.atualizar(id, req.body);
      res.json(servico);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async atualizarStatus(req, res) {
    try {
      const id = Number(req.params.id);
      const { status } = req.body;
      const servico = await ServicoService.atualizarStatus(id, status);
      res.json(servico);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deletar(req, res) {
    try {
      const id = Number(req.params.id);
      await ServicoService.deletar(id);
      return res
        .status(200)
        .json(ApiOutputs.success('Cliente deletado com sucesso'));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async listarPorTipoServico(req, res) {
    try {
      const tipoServicoId = Number(req.params.tipoServicoId);
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const profissional = await prisma.profissional.findUnique({
        where: { id: Number(decoded.id) },
      });

      if (!profissional || !profissional.active) {
        return res
          .status(403)
          .json({ error: 'Profissional inativo ou não encontrado' });
      }

      const servicos = await ServicoService.listarPorTipoServico(tipoServicoId);
      res.json(servicos);
    } catch (error) {
      console.error('Erro ao listar por tipo de serviço:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async confirmarVisitaCliente(req, res) {
    try {
      const { orcamentoId } = req.body;

      if (!orcamentoId) {
        return res.status(400).json({ error: 'Orçamento ID é obrigatório.' });
      }

      const orcamentoAtualizado =
        await ServicoService.confirmarVisitaCliente(orcamentoId);

      return res.json({
        message: 'Visita técnica confirmada com sucesso',
        orcamento: orcamentoAtualizado,
      });
    } catch (error) {
      console.error('Erro ao confirmar visita técnica:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  async confirmarVisitaParceiro(req, res) {
    try {
      const { orcamentoId } = req.body;
      if (!orcamentoId) {
        return res.status(400).json({ error: 'orcamentoId é obrigatório' });
      }
      const orcamentoAtualizado =
        await ServicoService.confirmarVisitaParceiro(orcamentoId);
      return res.json({
        message: 'Visita técnica confirmada pelo parceiro.',
        orcamento: orcamentoAtualizado,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ServicoController();
