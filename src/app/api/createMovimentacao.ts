'use server'

import { prisma } from "../../../database/db";

type CreateMovimentacaoProps = {
  pessoaId: string;
  tipo: "Entrada" | "Saida";
  categoria: "Pessoa" | "Veiculo";
  veiculoId?: string | null;
  datahora: Date;
};

export default async function createMovimentacao(data: CreateMovimentacaoProps) {
  try {
    // Buscar a última lista criada
    const ultimaLista = await prisma.listas.findFirst({
      orderBy: {
        createAt: "desc",
      },
    });

    if (!ultimaLista) {
      return { success: false, message: "Nenhuma lista encontrada para registrar a movimentação." };
    }

    const novaMovimentacao = await prisma.movimentos.create({
      data: {
        pessoaId: data.pessoaId,
        tipo: data.tipo,
        categoria: data.categoria,
        veiculoId: data.categoria === "Veiculo" ? data.veiculoId ?? null : null,
        listaId: ultimaLista.id,
        datahora: data.datahora,
      },
    });

    return { success: true, movimentacao: novaMovimentacao };

  } catch (error) {
    console.error("Erro ao criar movimentação:", error);
    // @ts-expect-error
    return { success: false, message: error.message };
  }
}
