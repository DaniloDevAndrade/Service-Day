// src/app/entryandexit/api/editViatura.ts
"use server";

import { prisma } from "../../../../database/db";

type EditViaturaProps = {
  id: string;
  prefixo: string;
  modelo: string;
};

export default async function editViatura(data: EditViaturaProps) {
  try {
    const viaturaAtualizada = await prisma.veiculos.update({
      where: {
        id: data.id,
      },
      data: {
        placa: data.prefixo,
        modelo: data.modelo,
        tipo: "Viatura",
      },
    });

    return { success: true, viatura: viaturaAtualizada };
  } catch (error) {
    console.error("Erro ao editar viatura:", error);
    // @ts-expect-error: erro do tipo unknown sem verificação explícita
    return { success: false, message: error.message };
  }
}
