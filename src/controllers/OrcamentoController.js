const OrcamentoService = require("../services/OrcamentoService");

class OrcamentoController {
  async criar(req, res) {
    try {
      const orcamento = await OrcamentoService.criar(req.body);
      res.status(201).json(orcamento);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
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
        return res.status(404).json({ error: "Orçamento não encontrado" });
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
      const orcamentos = await OrcamentoService.listarPorProfissional(
        profissionalId
      );
      res.json(orcamentos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async atualizar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const orcamento = await OrcamentoService.atualizar(id, req.body);
      res.json(orcamento);
    } catch (error) {
      res.status(400).json({ error: error.message });
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
        .json(ApiOutputs.success("Cliente deletado com sucesso"));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new OrcamentoController();
