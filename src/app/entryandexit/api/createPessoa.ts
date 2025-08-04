'use server'

import { Patentes } from "@/generated/prisma";
import { prisma } from "../../../../database/db";


type CreatePessoaProps = {
  name: string;
  documento: string;
  patente: string;
  unidade: string;
  possuiVeiculo: "sim" | "nao";
  veiculo?: {
    placa: string;
    modelo: string;
    tipo?: "Viatura" | "Particular"
    cartao: string;
  }[];
};

export default async function createPessoa(data: CreatePessoaProps) {
  try {
    const novaPessoa = await prisma.pessoas.create({
      data: {
        nome: data.name,
        documento: data.documento,
        patente: data.patente as Patentes,
        unidade: data.unidade,
        veiculos: data.possuiVeiculo === "sim" && data.veiculo
          ? {
              create: data.veiculo.map((v) => ({
                placa: v.placa,
                modelo: v.modelo,
                cartao: v.cartao,
                tipo: v.tipo ?? "Particular",
              })),
            }
          : undefined,
      },
      include: {
        veiculos: true,
      },
    });

    return { success: true, pessoa: novaPessoa };

  } catch (error) {
    console.error("Erro ao criar pessoa:", error);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return { success: false, message: error.message };
  }
}
