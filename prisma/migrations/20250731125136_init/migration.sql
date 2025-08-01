-- CreateEnum
CREATE TYPE "public"."Patentes" AS ENUM ('Coronel', 'TenenteCoronel', 'Major', 'Capitao', 'PrimeiroTenente', 'SegundoTenente', 'Aspirante', 'AlunoOficial', 'SubTenente', 'PrimeiroSargento', 'SegundoSargento', 'TerceiroSargento', 'AlunoSargento', 'Cabo', 'Soldado', 'Civil', 'Outros');

-- CreateEnum
CREATE TYPE "public"."Tipos" AS ENUM ('Viatura', 'Particular', 'Outros');

-- CreateTable
CREATE TABLE "public"."Pessoas" (
    "id" TEXT NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "documento" VARCHAR(255) NOT NULL,
    "patente" "public"."Patentes" NOT NULL DEFAULT 'Civil',
    "unidade" VARCHAR(255) NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pessoas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Veiculos" (
    "id" TEXT NOT NULL,
    "placa" VARCHAR(255) NOT NULL,
    "tipo" "public"."Tipos" NOT NULL DEFAULT 'Particular',
    "modelo" VARCHAR(255) NOT NULL,
    "cartao" VARCHAR(255) NOT NULL,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "pessoasId" TEXT,

    CONSTRAINT "Veiculos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pessoas_documento_key" ON "public"."Pessoas"("documento");

-- AddForeignKey
ALTER TABLE "public"."Veiculos" ADD CONSTRAINT "Veiculos_pessoasId_fkey" FOREIGN KEY ("pessoasId") REFERENCES "public"."Pessoas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
