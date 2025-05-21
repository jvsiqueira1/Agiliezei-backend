const ClienteService = require('../services/ClienteService');
const ApiOutputs = require('../helpers/ApiOutputs');

class ClienteController {
  async criar(req, res) {
    try {
      const cliente = await ClienteService.criar(req.body);
      return res
        .status(201)
        .json(ApiOutputs.created(cliente, 'Cliente criado com sucesso'));
    } catch (error) {
      console.error(error);
      return res
        .status(400)
        .json(
          ApiOutputs.badRequest(
            'Não foi possível criar o cliente!',
            error.message,
          ),
        );
    }
  }

  async listarTodos(req, res) {
    try {
      const { page, limit, search } = req.query;

      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 10;
      const searchStr = search ? String(search) : '';

      const clientes = await ClienteService.listarTodos({
        page: pageNum,
        limit: limitNum,
        search: searchStr,
      });

      return res.json(
        ApiOutputs.success(clientes, 'Clientes listados com sucesso'),
      );
    } catch (error) {
      return res.status(500).json(ApiOutputs.error(error.message));
    }
  }

  async buscarPorId(req, res) {
    try {
      const id = parseInt(req.params.id);
      const cliente = await ClienteService.buscarPorId(id);

      if (!cliente) {
        return res
          .status(404)
          .json(ApiOutputs.notFound('Cliente não encontrado'));
      }

      return res.json(ApiOutputs.success(cliente));
    } catch (error) {
      return res.status(500).json(ApiOutputs.error(error.message));
    }
  }

  async buscarPorTelefone(req, res) {
    try {
      const { telefone } = req.params;
      const cliente = await ClienteService.buscarPorTelefone(telefone);

      if (!cliente) {
        return res
          .status(404)
          .json(ApiOutputs.notFound('Cliente não encontrado'));
      }
      return res.json(ApiOutputs.success(cliente))
    } catch (error) {
      return res.status(500).json(ApiOutputs.error(error.message));
    }
  }

  async atualizar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const cliente = await ClienteService.atualizar(id, req.body);
      return res.json(
        ApiOutputs.success(cliente, 'Cliente atualizado com sucesso'),
      );
    } catch (error) {
      return res.status(400).json(ApiOutputs.badRequest(error.message));
    }
  }

  async deletar(req, res) {
    try {
      const id = parseInt(req.params.id);
      await ClienteService.deletar(id);
      return res
        .status(200)
        .json(ApiOutputs.success('Cliente deletado com sucesso'));
    } catch (error) {
      return res.status(400).json(ApiOutputs.badRequest(error.message));
    }
  }
}

module.exports = new ClienteController();
