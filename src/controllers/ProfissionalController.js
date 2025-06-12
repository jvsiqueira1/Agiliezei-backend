const ProfissionalService = require('../services/ProfissionalService');
const ApiOutputs = require('../helpers/ApiOutputs');
const upload = require('../helpers/upload');
const ServicoService = require('../services/ServicoService');

class ProfissionalController {
  async criar(req, res) {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json(ApiOutputs.badRequest('Foto do documento é obrigatória'));
      }

      console.log('Arquivo encontrado:', req.file);
      const fotoDocumento = req.file.filename;

      console.log('foto_documento (nome do arquivo): ', fotoDocumento);

      const profissional = await ProfissionalService.criar({
        ...req.body,
        foto_documento: fotoDocumento,
      });
      return res
        .status(201)
        .json(
          ApiOutputs.created(profissional, 'Profissional criado com sucesso'),
        );
    } catch (error) {
      console.error(error);
      return res.status(400).json(ApiOutputs.badRequest(error.message));
    }
  }

  async listarTodos(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';
      const tipoServicoId = req.query.tipoServicoId || null;

      const resultado = await ProfissionalService.listarTodos({
        page,
        limit,
        search,
        tipoServicoId,
      });

      return res.json(
        ApiOutputs.success(resultado, 'Profissionais listados com sucesso'),
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
          .json(ApiOutputs.notFound('Profissional não encontrado'));
      }
      return res.json(ApiOutputs.success(profissional));
    } catch (error) {
      return res.status(500).json(ApiOutputs.error(error.message));
    }
  }

  async buscarPorTipoServico(req, res) {
    try {
      const { tipoServico } = req.params;
      const profissionais =
        await ProfissionalService.listarPorTipoServico(tipoServico);
      return res.json(ApiOutputs.success(profissionais));
    } catch (error) {
      return res.status(500).json(ApiOutputs.error(error.message));
    }
  }

  async buscarPorTelefone(req, res) {
    try {
      const telefone = req.params.telefone;
      const profissional = await ProfissionalService.buscarPorTelefone(telefone);
      if (!profissional) {
        return res
          .status(404)
          .json(ApiOutputs.notFound('Profissional não encontrado'));
      }
      console.log('Profissional encontrado:', profissional);
      return res.json(ApiOutputs.success(profissional));
    } catch (error) {
      return res.status(500).json(ApiOutputs.error(error.message));
    }
  }

  async listarServicos(req, res) {
    try {
      const profissionalId = Number(req.params.id);
      const servicos =
        await ServicoService.listarPorProfissional(profissionalId);
      res.json({ success: true, data: servicos });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async atualizar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const profissional = await ProfissionalService.atualizar(id, req.body);
      return res.json(
        ApiOutputs.success(profissional, 'Profissional atualizado com sucesso'),
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
        .json(ApiOutputs.success('Cliente deletado com sucesso'));
    } catch (error) {
      return res.status(400).json(ApiOutputs.badRequest(error.message));
    }
  }
}

module.exports = new ProfissionalController();
