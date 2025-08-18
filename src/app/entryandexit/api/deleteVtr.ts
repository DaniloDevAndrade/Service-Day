import { prisma } from "../../../../database/db";

export default async function deleteViatura(id: string) {
  try {
    await prisma.veiculos.delete({
      where: {
        id,
      },
    });

    return { success: true };
  } catch (error: unknown) {
    console.error("Erro ao excluir viatura:", error);

    if (error instanceof Error) {
      return { success: false, message: error.message };
    }

    return { success: false, message: "Erro desconhecido ao excluir viatura." };
  }
}
