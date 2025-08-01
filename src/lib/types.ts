import { Movimentos, Pessoas, Prisma, Veiculos } from "@/generated/prisma"

export type MovimentoComRelacionados = Prisma.MovimentosGetPayload<{
  include: {
    pessoa: {
      include: {
        veiculos: true;
      };
    };
    veiculo: true;
  };
}>;


export type MovimentoCompleto = Movimentos & {
  pessoa: Pessoas & {
    veiculos: Veiculos[];
  };
  veiculo?: Veiculos | null;
};