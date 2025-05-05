const prisma = require("../config/prisma");

class AdminService {
  async criar(data) {
    // Em produção, deveria hash a senha antes de salvar
    return prisma.admin.create({
      data,
    });
  }

  async listarTodos() {
    return prisma.admin.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        // Não enviamos a senha
      },
    });
  }

  async buscarPorId(id) {
    return prisma.admin.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        // Não enviamos a senha
      },
    });
  }

  async buscarPorEmail(email) {
    return prisma.admin.findUnique({
      where: { email },
    });
  }

  async atualizar(id, data) {
    // Em produção, deveria hash a senha antes de salvar
    return prisma.admin.update({
      where: { id },
      data,
      select: {
        id: true,
        nome: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        // Não enviamos a senha
      },
    });
  }

  async deletar(id) {
    return prisma.admin.delete({
      where: { id },
    });
  }
}

module.exports = new AdminService();
