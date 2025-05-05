const ServicoService = require("../services/ServicoService");
const ApiOutputs = require("../helpers/ApiOutputs");

class ServicoController {
  async criar(req, res) {
    try {
      const servico = await ServicoService.criar(req.body);
      res.status(201).json(servico);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  async listarTodos(req, res) {
    try {
      const servicos = await ServicoService.listarTodos();
      res.json(servicos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async buscarPorId(req, res) {
    try {
      const id = parseInt(req.params.id);
      const servico = await ServicoService.buscarPorId(id);

      if (!servico) {
        return res.status(404).json({ error: "Serviço não encontrado" });
      }

      res.json(servico);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async listarPorCliente(req, res) {
    try {
      const clienteId = parseInt(req.params.id);
      const servicos = await ServicoService.listarPorCliente(clienteId);
      res.json(servicos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async listarPorProfissional(req, res) {
    try {
      const profissionalId = parseInt(req.params.profissionalId);
      const servicos = await ServicoService.listarPorProfissional(
        profissionalId
      );
      res.json(servicos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async listarOrcamentos(req, res) {
    try {
      const servicoId = parseInt(req.params.servicoId);
      const orcamentos = await ServicoService.listarOrcamentos(servicoId);
      return res.json(
        ApiOutputs.success(orcamentos, "Orçamentos listados com sucesso")
      );
    } catch (error) {
      console.error(error);
      return res.status(500).json(ApiOutputs.error(error.message));
    }
  }

  async escolherOrcamento(req, res) {
    try {
      const servicoId = parseInt(req.params.id);
      const { orcamentoId } = req.body;

      const servico = await ServicoService.escolherOrcamento(
        servicoId,
        parseInt(orcamentoId)
      );
      return res.json(
        ApiOutputs.success(servico, "Orçamento escolhido com sucesso")
      );
    } catch (error) {
      console.error(error);
      return res.status(400).json(ApiOutputs.badRequest(error.message));
    }
  }

  async atualizar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const servico = await ServicoService.atualizar(id, req.body);
      res.json(servico);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async atualizarStatus(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const servico = await ServicoService.atualizarStatus(id, status);
      res.json(servico);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deletar(req, res) {
    try {
      const id = parseInt(req.params.id);
      await ServicoService.deletar(id);
      return res
        .status(200)
        .json(ApiOutputs.success("Cliente deletado com sucesso"));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new ServicoController();
