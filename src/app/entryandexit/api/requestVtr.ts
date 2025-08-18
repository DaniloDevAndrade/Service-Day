// src/app/entryandexit/api/requestViaturas.ts
"use server";

import { prisma } from "../../../../database/db";

export default async function requestViaturas() {
  try {
    const viaturas = await prisma.veiculos.findMany({
      where: {
        tipo: "Viatura",
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return { success: true, viaturas };
  } catch (error) {
    console.error("Erro ao buscar viaturas:", error);
    // @ts-expect-error: erro do tipo unknown sem verificação explícita
    return { success: false, message: error.message };
  }
}
