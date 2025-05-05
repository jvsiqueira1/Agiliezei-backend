const ProfissionalService = require("../services/ProfissionalService");
const ApiOutputs = require("../helpers/ApiOutputs");

class ProfissionalController {
  async criar(req, res) {
    try {
      const profissional = await ProfissionalService.criar(req.body);
      return res
        .status(201)
        .json(
          ApiOutputs.created(profissional, "Profissional criado com sucesso")
        );
    } catch (error) {
      console.error(error);
      return res.status(400).json(ApiOutputs.badRequest(error.message));
    }
  }

  async listarTodos(req, res) {
    try {
      const profissionais = await ProfissionalService.listarTodos();
      return res.json(
        ApiOutputs.success(profissionais, "Profissionais listados com sucesso")
      );
    } catch (error) {
      return res.status(500).json(ApiOutputs.error(error.message));
    }
  }

  async buscarPorId(req, res) {
    try {
      const id = parseInt(req.params.id);
      const profissional = await ProfissionalService.buscarPorId(id);
      if (!profissional) {
        return res
          .status(404)
          .json(ApiOutputs.notFound("Profissional não encontrado"));
      }
      return res.json(ApiOutputs.success(profissional));
    } catch (error) {
      return res.status(500).json(ApiOutputs.error(error.message));
    }
  }

  async buscarPorTipoServico(req, res) {
    try {
      const { tipoServico } = req.params;
      const profissionais = await ProfissionalService.listarPorTipoServico(
        tipoServico
      );
      return res.json(ApiOutputs.success(profissionais));
    } catch (error) {
      return res.status(500).json(ApiOutputs.error(error.message));
    }
  }

  async atualizar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const profissional = await ProfissionalService.atualizar(id, req.body);
      return res.json(
        ApiOutputs.success(profissional, "Profissional atualizado com sucesso")
      );
    } catch (error) {
      return res.status(400).json(ApiOutputs.badRequest(error.message));
    }
  }

  async deletar(req, res) {
    try {
      const id = parseInt(req.params.id);
      await ProfissionalService.deletar(id);
      return res
        .status(200)
        .json(ApiOutputs.success("Cliente deletado com sucesso"));
    } catch (error) {
      return res.status(400).json(ApiOutputs.badRequest(error.message));
    }
  }
}

module.exports = new ProfissionalController();
