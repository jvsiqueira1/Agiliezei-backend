const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

async function main() {
    const adminEmail = process.env.SEED_EMAIL
    const adminPlainPassword = process.env.SEED_PASS

    const hashedPassword = bcrypt.hash(adminPlainPassword, 10);

    await prisma.admin.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
          nome: 'Administrador',
          email: adminEmail,
          senha: hashedPassword,
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
