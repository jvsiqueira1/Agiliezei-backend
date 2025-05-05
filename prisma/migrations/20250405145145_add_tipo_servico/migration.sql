/*
  Warnings:

  - You are about to drop the column `tipoServico` on the `Servico` table. All the data in the column will be lost.
  - You are about to drop the `_ProfissionalToTipoServico` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nome]` on the table `TipoServico` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tipoServicoId` to the `Profissional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoServicoId` to the `Servico` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ProfissionalToTipoServico" DROP CONSTRAINT "_ProfissionalToTipoServico_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProfissionalToTipoServico" DROP CONSTRAINT "_ProfissionalToTipoServico_B_fkey";

-- AlterTable
ALTER TABLE "Profissional" ADD COLUMN     "tipoServicoId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Servico" DROP COLUMN "tipoServico",
ADD COLUMN     "tipoServicoId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "TipoServico" ALTER COLUMN "descricao" DROP NOT NULL;

-- DropTable
DROP TABLE "_ProfissionalToTipoServico";

-- CreateIndex
CREATE UNIQUE INDEX "TipoServico_nome_key" ON "TipoServico"("nome");

-- AddForeignKey
ALTER TABLE "Profissional" ADD CONSTRAINT "Profissional_tipoServicoId_fkey" FOREIGN KEY ("tipoServicoId") REFERENCES "TipoServico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servico" ADD CONSTRAINT "Servico_tipoServicoId_fkey" FOREIGN KEY ("tipoServicoId") REFERENCES "TipoServico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
