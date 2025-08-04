"use server";

import { prisma } from "../../../../database/db";

export default async function createViatura({
  prefixo,
  modelo,
}: {
  prefixo: string;
  modelo: string;
}) {
  try {
    await prisma.veiculos.create({
      data: {
        placa: prefixo,
        modelo,
        cartao: "N/A", // se não utilizar cartão em viaturas
        tipo: "Viatura",
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Erro ao registrar viatura:", error);
    return {
      success: false,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      message: error?.message ?? "Erro inesperado ao registrar viatura.",
    };
  }
}
