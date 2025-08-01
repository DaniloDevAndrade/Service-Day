/*
  Warnings:

  - You are about to drop the column `categoria` on the `Listas` table. All the data in the column will be lost.
  - You are about to drop the column `listasId` on the `Pessoas` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Pessoas" DROP CONSTRAINT "Pessoas_listasId_fkey";

-- AlterTable
ALTER TABLE "public"."Listas" DROP COLUMN "categoria";

-- AlterTable
ALTER TABLE "public"."Pessoas" DROP COLUMN "listasId";

-- CreateTable
CREATE TABLE "public"."Movimentos" (
    "id" TEXT NOT NULL,
    "categoria" "public"."Categoria" NOT NULL DEFAULT 'Pessoa',
    "pessoaId" TEXT NOT NULL,
    "veiculoId" TEXT,
    "listaId" TEXT NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Movimentos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Movimentos" ADD CONSTRAINT "Movimentos_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "public"."Pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Movimentos" ADD CONSTRAINT "Movimentos_veiculoId_fkey" FOREIGN KEY ("veiculoId") REFERENCES "public"."Veiculos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Movimentos" ADD CONSTRAINT "Movimentos_listaId_fkey" FOREIGN KEY ("listaId") REFERENCES "public"."Listas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
