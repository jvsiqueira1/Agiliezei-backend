/*
  Warnings:

  - You are about to drop the column `dataVisitaTecnica` on the `Servico` table. All the data in the column will be lost.
  - You are about to drop the column `precisaVisitaTecnica` on the `Servico` table. All the data in the column will be lost.
  - You are about to drop the column `visitaTecnicaConfirmada` on the `Servico` table. All the data in the column will be lost.
  - You are about to drop the column `visitaTecnicaRealizada` on the `Servico` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Orcamento" ADD COLUMN     "visitaTecnicaConfirmada" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "Servico" DROP COLUMN "dataVisitaTecnica",
DROP COLUMN "precisaVisitaTecnica",
DROP COLUMN "visitaTecnicaConfirmada",
DROP COLUMN "visitaTecnicaRealizada";
