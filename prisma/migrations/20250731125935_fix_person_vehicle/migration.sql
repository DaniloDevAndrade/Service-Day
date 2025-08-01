/*
  Warnings:

  - You are about to drop the column `pessoasId` on the `Veiculos` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Veiculos" DROP CONSTRAINT "Veiculos_pessoasId_fkey";

-- AlterTable
ALTER TABLE "public"."Pessoas" ADD COLUMN     "veiculosId" TEXT;

-- AlterTable
ALTER TABLE "public"."Veiculos" DROP COLUMN "pessoasId";

-- AddForeignKey
ALTER TABLE "public"."Pessoas" ADD CONSTRAINT "Pessoas_veiculosId_fkey" FOREIGN KEY ("veiculosId") REFERENCES "public"."Veiculos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
