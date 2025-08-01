'use server'
import { prisma } from "../../../database/db"

export async function fetchMovimentos() {
  try {
    const findMovimentos = await prisma.listas.findFirst({
      orderBy: {
        createAt: 'desc'
      },
      include: {
        Movimentos: {
          orderBy: {
            datahora: 'desc'
          },
          include: {
            pessoa: {
              include: {
                veiculos: true,
              },
            },
            veiculo: true,
          }
        }
      }
    });

    return { success: true, movimentos: findMovimentos?.Movimentos ?? [] };
  } catch (error) {
    console.log(error);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return { success: false, message: error.message };
  }
}
