-- AlterTable
ALTER TABLE "Servico" ADD COLUMN     "dataVisitaTecnica" TIMESTAMP(3),
ADD COLUMN     "precisaVisitaTecnica" BOOLEAN DEFAULT false;
