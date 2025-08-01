'use server';

import { prisma } from "../../../database/db";

type EditMovimentoProps = {
  id: string;
  tipo: "Entrada" | "Saida"; // conforme enum TiposMovimentos
  categoria: "Pessoa" | "Veiculo";
  datahora: Date;
  pessoaId: string;
  veiculoId?: string | null;
  listaId: string;
};

export default async function editMovimento(data: EditMovimentoProps) {
  try {
    const movimentoAtualizado = await prisma.movimentos.update({
      where: {
        id: data.id,
      },
      data: {
        tipo: data.tipo,
        categoria: data.categoria,
        datahora: data.datahora,
        pessoaId: data.pessoaId,
        veiculoId: data.veiculoId ?? null,
        listaId: data.listaId,
      },
      include: {
        pessoa: true,
        veiculo: true,
        lista: true,
      },
    });

    return { success: true, movimento: movimentoAtualizado };
  } catch (error) {
    console.error("Erro ao editar movimentação:", error);
    // @ts-expect-error
    return { success: false, message: error.message };
  }
}
