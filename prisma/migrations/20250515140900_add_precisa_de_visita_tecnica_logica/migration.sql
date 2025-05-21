-- AlterTable
ALTER TABLE "Orcamento" ADD COLUMN     "dataVisitaTecnica" TIMESTAMP(3),
ADD COLUMN     "precisaVisitaTecnica" BOOLEAN NOT NULL DEFAULT false;
