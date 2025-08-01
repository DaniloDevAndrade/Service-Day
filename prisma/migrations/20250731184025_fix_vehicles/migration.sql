/*
  Warnings:

  - You are about to drop the column `veiculosId` on the `Pessoas` table. All the data in the column will be lost.
  - Added the required column `pessoaId` to the `Veiculos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Pessoas" DROP CONSTRAINT "Pessoas_veiculosId_fkey";

-- AlterTable
ALTER TABLE "public"."Pessoas" DROP COLUMN "veiculosId";

-- AlterTable
ALTER TABLE "public"."Veiculos" ADD COLUMN     "pessoaId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Veiculos" ADD CONSTRAINT "Veiculos_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "public"."Pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
