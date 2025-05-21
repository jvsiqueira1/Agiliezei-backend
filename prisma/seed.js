const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function main() {
    const adminEmail = 'admin@agilizei.com';
    const adminPlainPassword = 'senhaSegura123';

    const hashedPassword = await bcrypt.hash(adminPlainPassword, 10);

    await prisma.admin.upsert({
        where: { email: adminEmail },
        update: {}, // não atualiza se já existir
        create: {
          nome: 'Administrador',
          email: adminEmail,
          senha: hashedPassword,
          // Adicione outros campos obrigatórios do seu modelo Admin, se houver
        },
      });
    

  console.log('Seed finalizado');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
