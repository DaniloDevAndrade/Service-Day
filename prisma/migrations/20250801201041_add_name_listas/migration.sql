/*
  Warnings:

  - Added the required column `nome` to the `Listas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Listas" ADD COLUMN     "nome" VARCHAR(255) NOT NULL;
