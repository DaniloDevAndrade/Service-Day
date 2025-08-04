'use server'
import { prisma } from "../../../../database/db"

export default async function deleteMovimento(id: string) {
  try {
    await prisma.movimentos.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir movimentação:", error);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return { success: false, message: error.message };
  }
}
