const TipoServicoService = require('../services/TipoServicoService');
const ApiOutputs = require('../helpers/ApiOutputs');

class TipoServicoController {
  async criar(req, res) {
    try {
      const tipoServico = await TipoServicoService.criar(req.body);
      return res
        .status(201)
        .json(
          ApiOutputs.created(tipoServico, 'Tipo de serviço criado com sucesso'),
        );
    } catch (error) {
      console.error(error);
      return res.status(400).json(ApiOutputs.badRequest(error.message));
    }
  }

  async listarTodos(req, res) {
    try {
      const tiposServico = await TipoServicoService.listarTodos();
      return res.json(ApiOutputs.success(tiposServico));
    } catch (error) {
      return res.status(500).json(ApiOutputs.error(error.message));
    }
  }

  async buscarPorId(req, res) {
    try {
      const id = parseInt(req.params.id);
      const tipoServico = await TipoServicoService.buscarPorId(id);

      if (!tipoServico) {
        return res
          .status(404)
          .json(ApiOutputs.notFound('Tipo de serviço não encontrado'));
      }

      return res.json(ApiOutputs.success(tipoServico));
    } catch (error) {
      return res.status(500).json(ApiOutputs.error(error.message));
    }
  }

  async atualizar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const tipoServico = await TipoServicoService.atualizar(id, req.body);
      return res.json(
        ApiOutputs.success(
          tipoServico,
          'Tipo de serviço atualizado com sucesso',
        ),
      );
    } catch (error) {
      return res.status(400).json(ApiOutputs.badRequest(error.message));
    }
  }

  async deletar(req, res) {
    try {
      const id = parseInt(req.params.id);
      await TipoServicoService.deletar(id);
      return res
        .status(200)
        .json(ApiOutputs.success('Cliente deletado com sucesso'));
    } catch (error) {
      return res.status(400).json(ApiOutputs.badRequest(error.message));
    }
  }
}

module.exports = new TipoServicoController();
