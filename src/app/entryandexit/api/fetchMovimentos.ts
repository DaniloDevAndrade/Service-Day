'use server'
import { prisma } from "../../../../database/db"

export async function fetchMovimentos(userEmail: string, listaId?: string) {
  const user = await prisma.usuarios.findUnique({ where: { email: userEmail } });
  if (!user) return { success: false, message: "Usuário não encontrado" };

  const lista = listaId
    ? await prisma.listas.findUnique({
        where: { id: listaId },
        include: {
          Movimentos: {
            include: {
              pessoa: { include: { veiculos: true } },
              veiculo: true,
            },
            orderBy: { datahora: "desc" },
          },
        },
      })
    : await prisma.listas.findFirst({
        where: { usuariosId: user.id },
        orderBy: { createAt: "desc" },
        include: {
          Movimentos: {
            include: {
              pessoa: { include: { veiculos: true } },
              veiculo: true,
            },
            orderBy: { datahora: "desc" },
          },
        },
      });

  return {
    success: true,
    movimentos: lista?.Movimentos ?? [],
    listaId: lista?.id ?? null, // <-- aqui está a mudança principal
  };
}
