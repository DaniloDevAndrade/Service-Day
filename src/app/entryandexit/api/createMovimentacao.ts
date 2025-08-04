'use server'

import { prisma } from "../../../../database/db";

type CreateMovimentacaoProps = {
  pessoaId: string;
  tipo: "Entrada" | "Saida";
  categoria: "Pessoa" | "Veiculo";
  veiculoId?: string | null;
  datahora: Date;
  listaId: string; // <-- adicionado aqui
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
        listaId: data.listaId,
        datahora: data.datahora,
      },
    });


    return { success: true, movimentacao: novaMovimentacao };

  } catch (error) {
    console.error("Erro ao criar movimentação:", error);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return { success: false, message: error.message };
  }
}
