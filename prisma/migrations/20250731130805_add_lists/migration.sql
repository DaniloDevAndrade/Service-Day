-- CreateEnum
CREATE TYPE "public"."Categoria" AS ENUM ('Pessoa', 'Veiculo');

-- CreateTable
CREATE TABLE "public"."Listas" (
    "id" TEXT NOT NULL,
    "categoria" "public"."Categoria" NOT NULL DEFAULT 'Pessoa',
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "pessoasId" TEXT NOT NULL,

    CONSTRAINT "Listas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Listas" ADD CONSTRAINT "Listas_pessoasId_fkey" FOREIGN KEY ("pessoasId") REFERENCES "public"."Pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
