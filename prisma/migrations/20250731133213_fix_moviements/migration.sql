/*
  Warnings:

  - The `tipo` column on the `Veiculos` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."TiposVeiculos" AS ENUM ('Viatura', 'Particular', 'Outros');

-- CreateEnum
CREATE TYPE "public"."TiposMovimentos" AS ENUM ('Entrada', 'Saida');

-- AlterTable
ALTER TABLE "public"."Movimentos" ADD COLUMN     "hora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "tipo" "public"."TiposMovimentos" NOT NULL DEFAULT 'Entrada';

-- AlterTable
ALTER TABLE "public"."Veiculos" DROP COLUMN "tipo",
ADD COLUMN     "tipo" "public"."TiposVeiculos" NOT NULL DEFAULT 'Particular';

-- DropEnum
DROP TYPE "public"."Tipos";
