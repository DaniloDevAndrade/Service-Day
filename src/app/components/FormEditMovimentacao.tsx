"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Pessoas, Veiculos, Movimentos } from "@/generated/prisma";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import editMovimento from "../api/editmovimento";
import { MovimentoCompleto } from "@/lib/types";


const schema = z.object({
  tipo: z.enum(["Entrada", "Saida"]),
  categoria: z.enum(["Pessoa", "Veiculo"]),
  veiculoId: z.string().optional(),
  datahora: z.date(),
});

type FormEditMovimentacaoProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  movimento: MovimentoCompleto | null;
  atualizarLista: () => void;
};

export default function FormEditMovimentacao({
  open,
  setOpen,
  movimento,
  atualizarLista,
}: FormEditMovimentacaoProps) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      tipo: "Entrada",
      categoria: "Pessoa",
      veiculoId: undefined,
      datahora: new Date(),
    },
  });

  useEffect(() => {
    if (movimento) {
      form.reset({
        tipo: movimento.tipo,
        categoria: movimento.categoria,
        veiculoId: movimento.veiculoId ?? undefined,
        datahora: new Date(movimento.datahora),
      });
    }
  }, [movimento, form]);

  const onSubmit = async (values: z.infer<typeof schema>) => {
    if (!movimento) return;

    const payload = {
      id: movimento.id,
      tipo: values.tipo,
      categoria: values.categoria,
      datahora: values.datahora,
      pessoaId: movimento.pessoaId,
      veiculoId: values.categoria === "Veiculo" ? values.veiculoId || null : null,
      listaId: movimento.listaId,
    };

    const res = await editMovimento(payload);

    if (res.success) {
      setOpen(false);
      setTimeout(() => {
        atualizarLista();
      }, 200);
    } else {
      alert("Erro ao editar movimentação: " + res.message);
    }
  };

  if (!movimento) return null;

  const pessoa = movimento.pessoa;
  const veiculos = pessoa.veiculos;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Movimentação</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="font-semibold">{pessoa.nome}</p>
            <p className="text-sm text-muted-foreground">
              {pessoa.patente} | {pessoa.unidade}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

              {/* Data e Hora */}
              <FormField
                control={form.control}
                name="datahora"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data e Hora</FormLabel>
                    <div className="flex gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn("pl-3 text-left font-normal w-[180px]")}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value
                                ? field.value.toLocaleDateString("pt-BR")
                                : "Escolha a data"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              const updated = new Date(field.value || new Date());
                              updated.setFullYear(date?.getFullYear() ?? 0);
                              updated.setMonth(date?.getMonth() ?? 0);
                              updated.setDate(date?.getDate() ?? 0);
                              field.onChange(updated);
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>

                      <FormControl>
                        <Input
                          type="time"
                          className="w-full max-w-[6rem]"
                          value={field.value.toTimeString().slice(0, 5)}
                          onChange={(e) => {
                            const [hours, minutes] = e.target.value.split(":").map(Number);
                            const updated = new Date(field.value || new Date());
                            updated.setHours(hours);
                            updated.setMinutes(minutes);
                            field.onChange(updated);
                          }}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tipo */}
              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Entrada">Entrada</SelectItem>
                          <SelectItem value="Saida">Saída</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Categoria */}
              <FormField
                control={form.control}
                name="categoria"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pessoa">Pessoa a Pé</SelectItem>
                          <SelectItem value="Veiculo">Pessoa com Veículo</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Veículo */}
              {form.watch("categoria") === "Veiculo" && veiculos.length > 0 && (
                <FormField
                  control={form.control}
                  name="veiculoId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Veículo</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o veículo" />
                          </SelectTrigger>
                          <SelectContent>
                            {veiculos.map((v) => (
                              <SelectItem key={v.id} value={v.id}>
                                {v.placa} - {v.modelo}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Button type="submit" className="w-full">
                Salvar Alterações
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
