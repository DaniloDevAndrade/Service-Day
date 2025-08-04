"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { fetchListas } from "../api/requestListas";
import { criarLista } from "../api/createList";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteLista } from "../api/deleteLista";
import { toast } from "sonner";

type Lista = {
  id: string;
  nome: string;
  createAt: Date;
};

type Props = {
  userEmail: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  onSelecionarLista: (listaId: string) => void;
  onLimparListaSelecionada: () => void;
};

export default function FormSearchList({
  userEmail,
  open,
  setOpen,
  onSelecionarLista,
  onLimparListaSelecionada,
}: Props) {
  const [listas, setListas] = useState<Lista[]>([]);
  const [openNovaLista, setOpenNovaLista] = useState(false);
  const [nomeNovaLista, setNomeNovaLista] = useState("");
  const [isPending, startTransition] = useTransition();
  const [listaParaExcluir, setListaParaExcluir] = useState<Lista | null>(null);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const carregarListas = async () => {
    const res = await fetchListas(userEmail);
    setListas(res.success && Array.isArray(res.listas) ? res.listas : []);
  };

  useEffect(() => {
    if (open) {
      carregarListas();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleCriarNovaLista = () => {
    startTransition(async () => {
      const res = await criarLista(userEmail, nomeNovaLista);
      if (res.success && res.lista) {
        setOpenNovaLista(false);
        setNomeNovaLista("");
        await carregarListas();
        onSelecionarLista(res.lista.id);
        setOpen(false);
        toast(`Lista criada com sucesso!`);
      } else {
        alert(res.message || "Erro ao criar lista");
      }
    });
  };

  return (
    <>
      {/* Dialog de Seleção */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Selecionar Lista</DialogTitle>
            <DialogDescription>
              Selecione uma lista existente ou crie uma nova.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 max-h-[300px] overflow-auto pr-2">
            {listas.map((lista) => (
              <div
                key={lista.id}
                className="border rounded-md p-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{lista.nome}</p>
                  <p className="text-sm text-muted-foreground">
                    Criada em {new Date(lista.createAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-row gap-2">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setListaParaExcluir(lista);
                      setOpenConfirmDelete(true);
                    }}
                  >
                    Excluir
                  </Button>
                  <Button
                    onClick={() => {
                      onSelecionarLista(lista.id);
                      setOpen(false);
                    }}
                  >
                    Selecionar
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={() => {
              setOpen(false);
              setTimeout(() => setOpenNovaLista(true), 200);
            }}
            className="w-full mt-4"
          >
            <Plus className="h-4 w-4 mr-2" />
            Criar Nova Lista
          </Button>
        </DialogContent>
      </Dialog>

      {/* Dialog de Nova Lista */}
      <Dialog open={openNovaLista} onOpenChange={setOpenNovaLista}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Nova Lista</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Nome da nova lista"
              value={nomeNovaLista}
              onChange={(e) => setNomeNovaLista(e.target.value)}
            />
            <Button
              onClick={handleCriarNovaLista}
              className="w-full"
              disabled={isPending}
            >
              {isPending ? "Criando..." : "Criar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={openConfirmDelete} onOpenChange={setOpenConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja realmente excluir a lista{" "}
              <strong>{listaParaExcluir?.nome}</strong>? Esta ação não poderá
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={async () => {
                if (!listaParaExcluir) return;

                const res = await deleteLista(listaParaExcluir.id);
                if (res.success) {
                  await carregarListas();
                  onLimparListaSelecionada();
                  setListaParaExcluir(null);
                  setOpenConfirmDelete(false);
                } else {
                  alert(res.message || "Erro ao excluir a lista.");
                }
              }}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
