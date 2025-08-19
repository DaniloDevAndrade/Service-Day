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
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Pessoas } from "@/generated/prisma";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import createMovimentacao from "../api/createMovimentacao";
import { toast } from "sonner";
import requestViaturas from "../api/requestVtr";

type PessoaComVeiculos = Pessoas & {
  veiculos: {
    id: string;
    placa: string;
    modelo: string;
    cartao: string;
  }[];
};

type VeiculoBasico = {
  id: string;
  placa: string;
  modelo: string;
  tipo: "Particular" | "Viatura";
};

type VeiculoItem = { id: string; placa: string; modelo: string };

const schema = z.object({
  tipo: z.enum(["Entrada", "Saida"]),
  categoria: z.enum(["Pessoa", "Veiculo"]),
  tipoVeiculo: z.enum(["Particular", "Viatura"]).optional(),
  veiculoId: z.string().optional(),
  datahora: z.date(),
});

type FormMovimentacaoProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  pessoa: PessoaComVeiculos | null;
  atualizarLista: () => void;
  listaId: string;
  tipoInicial?: "Entrada" | "Saida" | null;
  veiculoInicial?: VeiculoBasico | null;
};

export default function FormMovimentacao({
  open,
  setOpen,
  pessoa,
  atualizarLista,
  listaId,
  tipoInicial,
  veiculoInicial,
}: FormMovimentacaoProps) {
  const [viaturas, setViaturas] = useState<VeiculoItem[]>([]);
  const [particulares, setParticulares] = useState<VeiculoItem[]>([]);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      tipo: tipoInicial ?? "Entrada",
      categoria: "Pessoa",
      tipoVeiculo: "Particular",
      veiculoId: undefined,
      datahora: new Date(),
    },
  });

  const categoria = useWatch({ control: form.control, name: "categoria" });
  const tipoVeiculo = useWatch({ control: form.control, name: "tipoVeiculo" });

  const pessoaVeiculos = pessoa?.veiculos ?? [];
  const merge = (base: VeiculoItem[], extra: VeiculoItem[]) => {
    const map = new Map<string, VeiculoItem>();
    [...base, ...extra].forEach((v) => map.set(v.id, v));
    return Array.from(map.values());
  };
  useEffect(() => {
    if (!open) return;

    setViaturas([]);
    setParticulares(pessoaVeiculos.map(({ id, placa, modelo }) => ({ id, placa, modelo })));

    if (veiculoInicial) {
      if (veiculoInicial.tipo === "Viatura") {
        setViaturas([{ id: veiculoInicial.id, placa: veiculoInicial.placa, modelo: veiculoInicial.modelo }]);

        form.reset({
          tipo: tipoInicial ?? "Entrada",
          categoria: "Veiculo",
          tipoVeiculo: "Viatura",
          veiculoId: veiculoInicial.id,
          datahora: new Date(),
        });

        (async () => {
          const res = (await requestViaturas()) as { success: boolean; viaturas?: VeiculoItem[] };
          if (res.success && res.viaturas) {
            setViaturas((prev) => merge(prev, res.viaturas!));
            const all = merge([{ id: veiculoInicial.id, placa: veiculoInicial.placa, modelo: veiculoInicial.modelo }], res.viaturas!);
            const stillThere = all.some((v) => v.id === veiculoInicial.id);
            if (!stillThere && all.length > 0) {
              form.setValue("veiculoId", all[0].id);
            }
          }
        })();
      } else {
        setParticulares((prev) => {
          const withInitial = merge(prev, [{ id: veiculoInicial.id, placa: veiculoInicial.placa, modelo: veiculoInicial.modelo }]);
          return withInitial;
        });

        form.reset({
          tipo: tipoInicial ?? "Entrada",
          categoria: "Veiculo",
          tipoVeiculo: "Particular",
          veiculoId: veiculoInicial.id,
          datahora: new Date(),
        });
      }
    } else {
      form.reset({
        tipo: tipoInicial ?? "Entrada",
        categoria: "Pessoa",
        tipoVeiculo: "Particular",
        veiculoId: undefined,
        datahora: new Date(),
      });
    }
  }, [open, tipoInicial, veiculoInicial, pessoaVeiculos, form]);

  useEffect(() => {
    if (categoria === "Veiculo" && (tipoVeiculo ?? "Particular") === "Particular") {
      if (!form.getValues("veiculoId") && particulares.length === 1) {
        form.setValue("veiculoId", particulares[0].id);
      }
    }
  }, [categoria, tipoVeiculo, particulares, form]);

  useEffect(() => {
    if (categoria !== "Veiculo") {
      form.setValue("veiculoId", undefined);
      return;
    }

    const t = tipoVeiculo ?? "Particular";
    if (t === "Particular") {
      if (particulares.length === 0 && pessoaVeiculos.length > 0) {
        const list = pessoaVeiculos.map(({ id, placa, modelo }) => ({ id, placa, modelo }));
        setParticulares(list);
        form.setValue("veiculoId", list[0].id);
      } else if (particulares.length > 0) {
        if (!form.getValues("veiculoId")) form.setValue("veiculoId", particulares[0].id);
      } else {
        form.setValue("veiculoId", undefined);
      }
    }
  }, [categoria, tipoVeiculo, particulares, pessoaVeiculos, form]);

  const onSubmit = async (values: z.infer<typeof schema>) => {
    if (!pessoa) return;

    const payload = {
      pessoaId: pessoa.id,
      tipo: values.tipo,
      categoria: values.categoria,
      veiculoId: values.categoria === "Veiculo" ? values.veiculoId || null : null,
      datahora: values.datahora,
      listaId,
    };

    const res = await createMovimentacao(payload);

    if (res.success) {
      form.reset({
        tipo: "Entrada",
        categoria: "Pessoa",
        tipoVeiculo: "Particular",
        veiculoId: undefined,
        datahora: new Date(),
      });
      setOpen(false);
      setViaturas([]);
      setParticulares([]);
      setTimeout(() => atualizarLista(), 200);
    } else {
      toast("Erro: " + res.message);
    }
  };

  if (!pessoa) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) {
          form.reset({
            tipo: "Entrada",
            categoria: "Pessoa",
            tipoVeiculo: "Particular",
            veiculoId: undefined,
            datahora: new Date(),
          });
          setViaturas([]);
          setParticulares([]);
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Movimentação</DialogTitle>
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
                              className={cn(
                                "pl-3 text-left font-normal w-[180px]",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? field.value.toLocaleDateString("pt-BR") : "Escolha a data"}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              if (!date) return;
                              const updated = new Date(field.value || new Date());
                              updated.setFullYear(date.getFullYear());
                              updated.setMonth(date.getMonth());
                              updated.setDate(date.getDate());
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
                          value={field.value ? field.value.toTimeString().slice(0, 5) : "00:00"}
                          onChange={(e) => {
                            const [hours, minutes] = e.target.value.split(":").map(Number);
                            const updated = new Date(field.value || new Date());
                            if (!Number.isNaN(hours)) updated.setHours(hours);
                            if (!Number.isNaN(minutes)) updated.setMinutes(minutes);
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
                    <FormLabel>Tipo de Movimentação</FormLabel>
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

              {/* Veículo e Tipo */}
              {categoria === "Veiculo" && (
                <>
                  <FormField
                    control={form.control}
                    name="tipoVeiculo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Veículo</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={async (value) => {
                              field.onChange(value);
                              if (value === "Viatura") {
                                const res = (await requestViaturas()) as { success: boolean; viaturas?: VeiculoItem[] };
                                const fetched = res.success && res.viaturas ? res.viaturas : [];
                                setViaturas((prev) => merge(prev, fetched));
                                const current = form.getValues("veiculoId");
                                const all = merge(viaturas, fetched);
                                const hasCurrent = current ? all.some((v) => v.id === current) : false;
                                if (!hasCurrent) form.setValue("veiculoId", all[0]?.id ?? undefined);
                              } else {
                                setParticulares((prev) => {
                                  if (prev.length === 0 && pessoaVeiculos.length > 0) {
                                    return pessoaVeiculos.map(({ id, placa, modelo }) => ({ id, placa, modelo }));
                                  }
                                  return prev;
                                });
                                const list = particulares.length > 0 ? particulares : pessoaVeiculos.map(({ id, placa, modelo }) => ({ id, placa, modelo }));
                                form.setValue("veiculoId", list[0]?.id ?? undefined);
                              }
                            }}
                            value={field.value ?? "Particular"}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Particular">Particular</SelectItem>
                              <SelectItem value="Viatura">Viatura</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="veiculoId"
                    render={({ field }) => {
                      const origem = (tipoVeiculo ?? "Particular") === "Viatura" ? viaturas : particulares;

                      return (
                        <FormItem>
                          <FormLabel>{(tipoVeiculo ?? "Particular") === "Viatura" ? "Viatura" : "Veículo"}</FormLabel>
                          <FormControl>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o veículo" />
                              </SelectTrigger>
                              <SelectContent>
                                {origem.map((v) => (
                                  <SelectItem key={v.id} value={v.id}>
                                    {v.placa} - {v.modelo}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </>
              )}

              <Button type="submit">Registrar</Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
