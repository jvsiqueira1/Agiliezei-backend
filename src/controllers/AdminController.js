const AdminService = require('../services/AdminService');
const TokenService = require('../services/TokenService');
const bcrypt = require('bcrypt');

class AdminController {
  async criar(req, res) {
    try {
      const admin = await AdminService.criar(req.body);
      res.status(201).json(admin);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  async listarTodos(req, res) {
    console.log('teste');
    try {
      const admins = await AdminService.listarTodos();
      res.json(admins);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async buscarPorId(req, res) {
    try {
      const id = parseInt(req.params.id);
      const admin = await AdminService.buscarPorId(id);

      if (!admin) {
        return res.status(404).json({ error: 'Admin não encontrado' });
      }

      res.json(admin);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async atualizar(req, res) {
    try {
      const id = parseInt(req.params.id);
      const admin = await AdminService.atualizar(id, req.body);
      res.json(admin);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deletar(req, res) {
    try {
      const id = parseInt(req.params.id);
      await AdminService.deletar(id);
      return res
        .status(200)
        .json(ApiOutputs.success('Cliente deletado com sucesso'));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async login(req, res) {
    const { email, senha } = req.body;

    // Verifica se o email e senha foram fornecidos
    if (!email || !senha) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    try {
      // Buscar admin no banco
      const admin = await AdminService.buscarPorEmail(email);

      if (!admin) {
        return res.status(404).json({ error: 'Admin não encontrado' });
      }

      const senhaValida = await bcrypt.compare(senha, admin.senha);

      if (!senhaValida) {
        return res.status(401).json({ error: 'Senha incorreta' });
      }

      const token = TokenService.gerarToken({
        id: admin.id,
        email: admin.email,
        role: 'admin',
      });

      return res.status(200).json({
        sucesso: true,
        token,
        usuario: {
          id: admin.id,
          email: admin.email,
          role: 'admin',
        },
      });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      res.status(500).json({ error: 'Erro ao realizar o login' });
    }
  }
}

module.exports = new AdminController();
