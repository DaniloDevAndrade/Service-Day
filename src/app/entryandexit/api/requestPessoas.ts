'use server'

import { Prisma } from "@/generated/prisma"
import { prisma } from "../../../../database/db"

type Props = {
  nomePessoa?: string
  documentoPessoa?: string
  placaPessoa?: string
}

export default async function fetchPessoas({ nomePessoa, documentoPessoa, placaPessoa }: Props) {
  try {
    let pessoas = [];

    if (placaPessoa) {
      const veiculos = await prisma.veiculos.findMany({
        where: {
          placa: placaPessoa,
        },
        select: {
          pessoaId: true,
        },
      });

      // Filtra IDs nulos
      const pessoaIds = veiculos
        .map((v) => v.pessoaId)
        .filter((id): id is string => id !== null);

      if (pessoaIds.length === 0) {
        return { success: true, pessoas: [] };
      }

      pessoas = await prisma.pessoas.findMany({
        where: {
          id: {
            in: pessoaIds,
          },
        },
        include: {
          veiculos: true,
        },
      });

    } else {
      // Filtro por nome ou documento
      const where: Prisma.PessoasWhereInput = {};

      if (nomePessoa) {
        where.nome = {
          contains: nomePessoa,
          mode: "insensitive",
        };
      }

      if (documentoPessoa) {
        where.documento = documentoPessoa;
      }

      pessoas = await prisma.pessoas.findMany({
        where,
        include: {
          veiculos: true,
        },
      });
    }

    return { success: true, pessoas };

  } catch (error) {
    console.error("Erro no fetchPessoas:", error);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return { success: false, message: error.message };
  }
}
