/*
  Warnings:

  - You are about to drop the column `hora` on the `Movimentos` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Veiculos" DROP CONSTRAINT "Veiculos_pessoaId_fkey";

-- AlterTable
ALTER TABLE "public"."Movimentos" DROP COLUMN "hora",
ADD COLUMN     "datahora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."Veiculos" ALTER COLUMN "pessoaId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Veiculos" ADD CONSTRAINT "Veiculos_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "public"."Pessoas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
