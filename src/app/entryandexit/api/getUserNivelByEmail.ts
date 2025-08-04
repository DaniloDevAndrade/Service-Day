// app/entryandexit/api/getUserNivelByEmail.ts
"use server";

import { prisma } from "../../../../database/db";

export async function getUserNivelByEmail(
  email: string
): Promise<"Admin" | "Comum" | null> {
  try {
    const user = await prisma.usuarios.findUnique({
      where: { email },
      select: { nivel: true },
    });

    return user?.nivel ?? null;
  } catch (error) {
    console.error("Erro ao buscar nível do usuário:", error);
    return null;
  }
}
