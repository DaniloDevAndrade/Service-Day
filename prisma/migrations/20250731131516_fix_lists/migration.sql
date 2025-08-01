/*
  Warnings:

  - You are about to drop the column `pessoasId` on the `Listas` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Listas" DROP CONSTRAINT "Listas_pessoasId_fkey";

-- AlterTable
ALTER TABLE "public"."Listas" DROP COLUMN "pessoasId";

-- AlterTable
ALTER TABLE "public"."Pessoas" ADD COLUMN     "listasId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Pessoas" ADD CONSTRAINT "Pessoas_listasId_fkey" FOREIGN KEY ("listasId") REFERENCES "public"."Listas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
