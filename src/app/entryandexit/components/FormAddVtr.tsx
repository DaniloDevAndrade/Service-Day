"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import createViatura from "../api/createVtr";
import { Pencil, Trash2 } from "lucide-react";
import requestViaturas from "../api/requestVtr";
import deleteViatura from "../api/deleteVtr";
import editViatura from "../api/editVtr";

const schema = z.object({
  prefixo: z.string().min(1, "Prefixo é obrigatório"),
  modelo: z.string().min(1, "Modelo é obrigatório"),
});

type FormData = z.infer<typeof schema>;

type Props = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

type Viatura = {
  id: string;
  prefixo: string;
  modelo: string;
};

export default function FormAddViatura({ open, setOpen }: Props) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { prefixo: "", modelo: "" },
  });

  const [mostrarLista, setMostrarLista] = useState(false);
  const [viaturas, setViaturas] = useState<Viatura[]>([]);
  const [viaturaEmEdicao, setViaturaEmEdicao] = useState<Viatura | null>(null);
  const [viaturaSelecionada, setViaturaSelecionada] = useState<Viatura | null>(
    null
  );

  const buscarViaturas = async () => {
    const res = await requestViaturas();
    if (res.success && res.viaturas) {
      setViaturas(
        res.viaturas.map((v: any) => ({
          id: v.id,
          prefixo: v.placa,
          modelo: v.modelo,
        }))
      );
    }
  };

  useEffect(() => {
    if (mostrarLista) buscarViaturas();
  }, [mostrarLista]);

  const onSubmit = async (values: FormData) => {
    if (viaturaEmEdicao) {
      const response = await editViatura({
        id: viaturaEmEdicao.id,
        prefixo: values.prefixo,
        modelo: values.modelo,
      });
      if (response.success) {
        toast("Viatura editada com sucesso!");
        setViaturaEmEdicao(null);
        buscarViaturas();
        setMostrarLista(true);
      } else {
        toast("Erro ao editar: " + response.message);
      }
    } else {
      const response = await createViatura(values);
      if (response.success) {
        toast("Viatura registrada com sucesso!");
        form.reset();
        setOpen(false);
      } else {
        toast("Erro: " + response.message);
      }
    }
  };

  useEffect(() => {
    if (viaturaEmEdicao) {
      form.setValue("prefixo", viaturaEmEdicao.prefixo);
      form.setValue("modelo", viaturaEmEdicao.modelo);
      setMostrarLista(false);
    }
  }, [viaturaEmEdicao]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gerenciar Viaturas</DialogTitle>
          <DialogDescription>
            Adicione ou edite viaturas cadastradas no sistema
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mb-4">
          <Button
            variant={mostrarLista ? "outline" : "default"}
            onClick={() => {
              setMostrarLista(false);
              setViaturaEmEdicao(null);
              form.reset();
            }}
          >
            {viaturaEmEdicao ? "Cancelar Edição" : "Adicionar Viatura"}
          </Button>
          <Button
            variant={mostrarLista ? "default" : "outline"}
            onClick={() => {
              setMostrarLista(true);
              setViaturaEmEdicao(null);
              form.reset();
            }}
          >
            Ver Viaturas
          </Button>
        </div>

        {!mostrarLista ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="prefixo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prefixo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: M-33001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="modelo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Spin / Trailblazer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">
                {viaturaEmEdicao ? "Salvar Alterações" : "Registrar"}
              </Button>
            </form>
          </Form>
        ) : (
          <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
            {viaturas.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center">
                Nenhuma viatura registrada.
              </p>
            ) : (
              viaturas.map((vtr) => (
                <div
                  key={vtr.id}
                  className="border p-3 rounded-md flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{vtr.prefixo}</p>
                    <p className="text-sm text-muted-foreground">
                      Modelo: {vtr.modelo}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setViaturaEmEdicao(vtr)}
                    >
                      <Pencil className="w-4 h-4 mr-1" /> Editar
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setViaturaSelecionada(vtr)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Excluir
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Confirmar exclusão
                          </AlertDialogTitle>
                        </AlertDialogHeader>
                        <p>
                          Deseja realmente excluir a viatura "
                          {viaturaSelecionada?.prefixo}"?
                        </p>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={async () => {
                              if (!viaturaSelecionada) return;
                              const res = await deleteViatura(
                                viaturaSelecionada.id
                              );
                              if (res.success) {
                                toast("Viatura excluída com sucesso");
                                buscarViaturas();
                              } else {
                                toast("Erro ao excluir: " + res.message);
                              }
                            }}
                          >
                            Confirmar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
