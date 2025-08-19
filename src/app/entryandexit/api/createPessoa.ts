'use server';

import { Patentes } from '@/generated/prisma';
import { prisma } from '../../../../database/db';

type CreatePessoaProps = {
  name: string;
  documento: string;
  patente: string;
  unidade: string;
  possuiVeiculo: 'sim' | 'nao';
  veiculo?: {
    placa: string;
    modelo: string;
    tipo?: 'Viatura' | 'Particular';
    cartao: string;
  }[];
};

export default async function createPessoa(data: CreatePessoaProps) {
  try {
    const documento = data.documento.replace(/\D/g, ''); // normaliza CPF/RE

    // 🔎 Verifica se já existe no banco
    const existente = await prisma.pessoas.findUnique({
      where: { documento },
    });

    if (existente) {
      return {
        success: false,
        message: 'Já existe uma pessoa registrada com este documento.',
      };
    }

    // Cria nova pessoa
    const novaPessoa = await prisma.pessoas.create({
      data: {
        nome: data.name,
        documento,
        patente: data.patente as Patentes,
        unidade: data.unidade,
        veiculos:
          data.possuiVeiculo === 'sim' && data.veiculo?.length
            ? {
                create: data.veiculo.map((v) => ({
                  placa: v.placa,
                  modelo: v.modelo,
                  cartao: v.cartao,
                  tipo: v.tipo ?? 'Particular',
                })),
              }
            : undefined,
      },
      include: { veiculos: true },
    });

    return { success: true, pessoa: novaPessoa };
  } catch (error) {
    console.error('Erro ao criar pessoa:', error);
    return { success: false, message: 'Erro ao criar pessoa.' };
  }
}
