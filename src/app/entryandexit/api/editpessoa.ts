'use server'

import { Patentes } from "@/generated/prisma";
import { prisma } from "../../../../database/db";

type EditPessoaProps = {
  id: string; // ID da pessoa a ser editada
  name: string;
  documento: string;
  patente: string;
  unidade: string;
  possuiVeiculo: "sim" | "nao";
  veiculo?: {
    placa: string;
    modelo: string;
    tipo?: "Viatura" | "Particular";
    cartao: string;
  }[];
};

export default async function editPessoa(data: EditPessoaProps) {
  try {
    // Atualiza os dados da pessoa
    await prisma.pessoas.update({
      where: {
        id: data.id,
      },
      data: {
        nome: data.name,
        documento: data.documento,
        patente: data.patente as Patentes,
        unidade: data.unidade,
      },
    });

    // Remove veículos antigos
    await prisma.veiculos.deleteMany({
      where: {
        pessoaId: data.id,
      },
    });

    // Cria os novos veículos se houver
    if (data.possuiVeiculo === "sim" && data.veiculo && data.veiculo.length > 0) {
      await prisma.veiculos.createMany({
        data: data.veiculo.map((v) => ({
          pessoaId: data.id,
          placa: v.placa,
          modelo: v.modelo,
          cartao: v.cartao,
          tipo: v.tipo ?? "Particular",
        })),
      });
    }

    const pessoaComVeiculos = await prisma.pessoas.findUnique({
      where: {
        id: data.id,
      },
      include: {
        veiculos: true,
      },
    });

    return { success: true, pessoa: pessoaComVeiculos };
  } catch (error) {
    console.error("Erro no editPessoa:", error);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return { success: false, message: error.message };
  }
}
