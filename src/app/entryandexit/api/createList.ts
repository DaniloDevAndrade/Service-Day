'use server'
import { prisma } from "../../../../database/db"

export async function criarLista(email: string, nome: string) {
  try {
    const user = await prisma.usuarios.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, message: "Usuário não encontrado" };
    }

    const novaLista = await prisma.listas.create({
      data: {
        nome,
        usuariosId: user.id,
      },
    });

    return { success: true, lista: novaLista };
  } catch (error) {
    console.error("Erro ao criar lista:", error);
    return { success: false, message: "Erro ao criar lista" };
  }
}
