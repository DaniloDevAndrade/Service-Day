'use server'
import { prisma } from "../../../../database/db"

export async function fetchListas(userEmail: string) {
  try {
    const user = await prisma.usuarios.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return { success: false, message: "Usuário não encontrado" };
    }

    const listas = await prisma.listas.findMany({
      where: { usuariosId: user.id },
      orderBy: { createAt: "desc" },
      select: {
        id: true,
        nome: true,
        createAt: true,
      },
    });

    return { success: true, listas };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Erro ao buscar listas" };
  }
}
