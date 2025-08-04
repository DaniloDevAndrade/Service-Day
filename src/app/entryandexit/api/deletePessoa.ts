'use server';

import { prisma } from "../../../../database/db";

export default async function deletePessoa(pessoaId: string) {
  try {
    // Verifica e deleta veículos se existirem
    const veiculos = await prisma.veiculos.findMany({
      where: { pessoaId },
      select: { id: true },
    });

    if (veiculos.length > 0) {
      await prisma.veiculos.deleteMany({
        where: { pessoaId },
      });
    }

    // Verifica e deleta movimentações se existirem
    const movimentos = await prisma.movimentos.findMany({
      where: { pessoaId },
      select: { id: true },
    });

    if (movimentos.length > 0) {
      await prisma.movimentos.deleteMany({
        where: { pessoaId },
      });
    }

    // Exclui a pessoa
    await prisma.pessoas.delete({
      where: { id: pessoaId },
    });

    return { success: true, message: "Pessoa excluída com sucesso." };
  } catch (error) {
    console.error("Erro ao excluir pessoa:", error);
    return {
      success: false,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
      message: error?.message ?? "Erro inesperado ao excluir pessoa.",
    };
  }
}
