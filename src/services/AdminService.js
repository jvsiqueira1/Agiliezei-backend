const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');

class AdminService {
  async criar(data) {
    const hashedPassword = await bcrypt.hash(data.senha, 10);
    return prisma.admin.create({
      data: {
        ...data,
        senha: hashedPassword,
      },
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
      },
    });
  }

  async buscarPorEmail(email) {
    return prisma.admin.findUnique({
      where: { email },
    });
  }

  async atualizar(id, data) {
    return prisma.admin.update({
      where: { id },
      data,
      select: {
        id: true,
        nome: true,
        email: true,
        createdAt: true,
        updatedAt: true,
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
