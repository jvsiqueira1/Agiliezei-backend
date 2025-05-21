-- CreateTable
CREATE TABLE "ContatoOutrosServicos" (
    "id" SERIAL NOT NULL,
    "telefone" TEXT NOT NULL,
    "tipoServico" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContatoOutrosServicos_pkey" PRIMARY KEY ("id")
);
