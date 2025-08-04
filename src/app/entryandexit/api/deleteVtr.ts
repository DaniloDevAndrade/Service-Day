// src/app/entryandexit/api/deleteViatura.ts
"use server";

import { prisma } from "../../../../database/db";

export default async function deleteViatura(id: string) {
  try {
    await prisma.veiculos.delete({
      where: {
        id,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir viatura:", error);
    // @ts-expect-error
    return { success: false, message: error.message };
  }
}
