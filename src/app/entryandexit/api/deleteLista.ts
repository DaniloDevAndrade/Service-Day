'use server';

import { prisma } from "../../../../database/db";

export async function deleteLista(listaId: string) {
  try {
    // Deleta todos os movimentos relacionados à lista
    await prisma.movimentos.deleteMany({
      where: {
        listaId,
      },
    });

    // Agora deleta a lista
    await prisma.listas.delete({
      where: { id: listaId },
    });

    return { success: true, message: "Lista excluída com sucesso." };
  } catch (error) {
    console.error("Erro ao excluir lista:", error);
    return {
      success: false,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      message: error?.message ?? "Erro inesperado ao excluir lista.",
    };
  }
}
