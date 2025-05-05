/*
  Warnings:

  - A unique constraint covering the columns `[telefone]` on the table `Profissional` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Profissional_telefone_key" ON "Profissional"("telefone");
