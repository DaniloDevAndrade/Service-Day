-- CreateEnum
CREATE TYPE "public"."Niveis" AS ENUM ('Admin', 'Comum');

-- AlterTable
ALTER TABLE "public"."Listas" ADD COLUMN     "usuariosId" TEXT;

-- CreateTable
CREATE TABLE "public"."Usuarios" (
    "id" TEXT NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "patente" "public"."Patentes" NOT NULL DEFAULT 'Soldado',
    "nivel" "public"."Niveis" NOT NULL DEFAULT 'Comum',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_email_key" ON "public"."Usuarios"("email");

-- AddForeignKey
ALTER TABLE "public"."Listas" ADD CONSTRAINT "Listas_usuariosId_fkey" FOREIGN KEY ("usuariosId") REFERENCES "public"."Usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
