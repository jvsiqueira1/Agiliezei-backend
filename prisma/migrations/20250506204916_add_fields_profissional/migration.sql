/*
  Warnings:

  - You are about to drop the column `dataNascimento` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `endereco` on the `Cliente` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cliente" DROP COLUMN "dataNascimento",
DROP COLUMN "endereco";

-- AlterTable
ALTER TABLE "Profissional" ADD COLUMN     "dataNascimento" TIMESTAMP(3),
ADD COLUMN     "endereco" TEXT;
