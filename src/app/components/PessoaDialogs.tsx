import { useState } from "react";
import FormSearch from "./FormSearch";
import FormAdd from "./FormAdd";
import FormEdit from "./FormEdit";
import { Pessoas } from "@/generated/prisma";
import FormMovimentacao from "./FormMovimentacao";

type PessoaComVeiculos = Pessoas & {
  veiculos: {
    id: string;
    placa: string;
    modelo: string;
    cartao: string;
  }[];
};

type Props = {
  atualizarLista: () => void;
};

export default function PessoaDialogs({ atualizarLista }: Props) {
  const [openSearch, setOpenSearch] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [pessoaSelecionada, setPessoaSelecionada] = useState<PessoaComVeiculos | null>(null);

  const [openMovimentacao, setOpenMovimentacao] = useState(false);
  const [pessoaParaMovimentacao, setPessoaParaMovimentacao] = useState<PessoaComVeiculos | null>(null);



  return (
    <>
      <FormSearch
        open={openSearch}
        setOpen={setOpenSearch}
        onNovaPessoaClick={() => {
          setOpenSearch(false)
          setOpenAdd(true)
        }}
        onEditarPessoaClick={(pessoa) => {
          setPessoaSelecionada(pessoa)
          setOpenSearch(false)
          setOpenEdit(true)
        }}
        onSelecionarPessoaClick={(pessoa) => {
          setPessoaParaMovimentacao(pessoa)
          setOpenSearch(false)
          setOpenMovimentacao(true)
        }}
      />

      <FormMovimentacao
        open={openMovimentacao}
        setOpen={setOpenMovimentacao}
        pessoa={pessoaParaMovimentacao}
        atualizarLista={atualizarLista}
      />

      <FormAdd open={openAdd} setOpen={setOpenAdd} />

      <FormEdit
        open={openEdit}
        setOpen={setOpenEdit}
        pessoa={pessoaSelecionada}
      />
    </>
  );
}
