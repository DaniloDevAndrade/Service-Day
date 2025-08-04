'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type Props = {
  open: boolean;
  setOpen: (value: boolean) => void;
  onConfirmar: (dados: {
    numeroParte: string;
    reResponsavel: string;
    nomeGuerra: string;
    horaInicio: string;
    horaFim: string;
  }) => void;
};

export default function DialogRelatorioPessoas({ open, setOpen, onConfirmar }: Props) {
  const [numeroParte, setNumeroParte] = useState("");
  const [reResponsavel, setReResponsavel] = useState("");
  const [nomeGuerra, setNomeGuerra] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFim, setHoraFim] = useState("");

  const handleGerar = () => {
    if (!numeroParte || !reResponsavel || !nomeGuerra || !horaInicio || !horaFim) {
      alert("Preencha todos os campos.");
      return;
    }
    onConfirmar({ numeroParte, reResponsavel, nomeGuerra, horaInicio, horaFim });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gerar Relatório de Pessoas</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="Número da Parte (ex: 144/010/25)" value={numeroParte} onChange={(e) => setNumeroParte(e.target.value)} />
          <Input placeholder="RE do Responsável" value={reResponsavel} onChange={(e) => setReResponsavel(e.target.value)} />
          <Input placeholder="Nome de Guerra" value={nomeGuerra} onChange={(e) => setNomeGuerra(e.target.value)} />
          <Input type="time" placeholder="Hora de Início" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
          <Input type="time" placeholder="Hora de Término" value={horaFim} onChange={(e) => setHoraFim(e.target.value)} />
          <Button onClick={handleGerar} className="w-full">
            Gerar PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
