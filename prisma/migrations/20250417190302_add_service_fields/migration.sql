/*
  Warnings:

  - Added the required column `bairro` to the `Servico` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cep` to the `Servico` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cidade` to the `Servico` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Servico` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endereco` to the `Servico` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estado` to the `Servico` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logradouro` to the `Servico` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome` to the `Servico` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numero` to the `Servico` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefone` to the `Servico` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Servico" ADD COLUMN     "areaMetragem" TEXT,
ADD COLUMN     "bairro" TEXT NOT NULL,
ADD COLUMN     "cep" TEXT NOT NULL,
ADD COLUMN     "cidade" TEXT NOT NULL,
ADD COLUMN     "complemento" TEXT,
ADD COLUMN     "condicao" TEXT,
ADD COLUMN     "descricaoItens" TEXT,
ADD COLUMN     "descricaoMoveis" TEXT,
ADD COLUMN     "descricaoProblema" TEXT,
ADD COLUMN     "descricaoServicoPedreiro" TEXT,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "endereco" TEXT NOT NULL,
ADD COLUMN     "estado" TEXT NOT NULL,
ADD COLUMN     "extras" TEXT,
ADD COLUMN     "foto" TEXT,
ADD COLUMN     "frequencia" TEXT,
ADD COLUMN     "horario" TEXT,
ADD COLUMN     "logradouro" TEXT NOT NULL,
ADD COLUMN     "nome" TEXT NOT NULL,
ADD COLUMN     "numero" TEXT NOT NULL,
ADD COLUMN     "origemDestino" TEXT,
ADD COLUMN     "prazo" TEXT,
ADD COLUMN     "quantidadeMoveis" INTEGER,
ADD COLUMN     "superficie" TEXT,
ADD COLUMN     "tamanhoImovel" TEXT,
ADD COLUMN     "telefone" TEXT NOT NULL,
ADD COLUMN     "tipoImovel" TEXT,
ADD COLUMN     "tipoLimpeza" TEXT,
ADD COLUMN     "tipoServicoEletrico" TEXT;
