"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Search } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod/v3";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Pessoas } from "@/generated/prisma";
import fetchPessoas from "../api/requestPessoas";

const formSchema = z
  .object({
    tipoBusca: z.enum(["documento", "name", "placa"]),
    name: z.string().optional(),
    documento: z.string().optional(),
    placa: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.tipoBusca === "placa") {
      if (!data.placa) {
        ctx.addIssue({
          path: ["placa"],
          code: z.ZodIssueCode.custom,
          message: "Informe a placa do veículo",
        });
      } else {
        const placa = data.placa.toUpperCase().trim();

        const placaAntiga = /^[A-Z]{3}-\d{4}$/.test(placa); // AAA-1234
        const placaMercosul = /^[A-Z]{3}-\d[A-J]\d{2}$/.test(placa); // AAA-1A23

        if (!placaAntiga && !placaMercosul) {
          ctx.addIssue({
            path: ["placa"],
            code: z.ZodIssueCode.custom,
            message:
              "Placa inválida. Use o formato AAA-1234 ou AAA-1A23 (Mercosul)",
          });
        }
      }
    } else if (data.tipoBusca === "documento") {
      if (!data.documento || !/^\d{6}$|^\d{11}$/.test(data.documento)) {
        ctx.addIssue({
          path: ["documento"],
          code: z.ZodIssueCode.custom,
          message: "Documento deve conter 6 ou 11 dígitos numéricos",
        });
      }
    } else if (data.tipoBusca === "name") {
      if (!data.name || data.name.trim().length < 3) {
        ctx.addIssue({
          path: ["name"],
          code: z.ZodIssueCode.custom,
          message: "Nome deve ter pelo menos 3 caracteres",
        });
      }
    }
  });

type FormSearchProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
  onNovaPessoaClick: () => void;
  onEditarPessoaClick: (pessoa: PessoaComVeiculos) => void;
  onSelecionarPessoaClick: (pessoa: PessoaComVeiculos) => void;
};

type PessoaComVeiculos = Pessoas & {
  veiculos: {
    id: string;
    placa: string;
    modelo: string;
    cartao: string;
  }[];
};

export default function FormSearch({ open, setOpen, onNovaPessoaClick, onEditarPessoaClick, onSelecionarPessoaClick }: FormSearchProps) {
  const [tipoBusca, setTipoBusca] = useState<"documento" | "name" | "placa">(
    "documento"
  );
  const [pessoasEncontradas, setPessoasEncontradas] = useState<PessoaComVeiculos[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipoBusca: "documento",
      name: "",
      documento: "",
      placa: "",
    },
  });

  const handleNovaBusca = () => {
    setPessoasEncontradas([]);
    form.reset({
      name: "",
      documento: "",
      placa: "",
    });
  };

  const handleSelecionarPessoa = (pessoa: Pessoas) => {
    console.log("Pessoa selecionada:", pessoa);
    // Aqui você pode passar a pessoa selecionada para outro componente ou armazenar em contexto
  };
  const patenteLabelMap: Record<string, string> = {
    Coronel: "Coronel",
    TenenteCoronel: "Tenente-Coronel",
    Major: "Major",
    Capitao: "Capitão",
    PrimeiroTenente: "1º Tenente",
    SegundoTenente: "2º Tenente",
    Aspirante: "Aspirante a Oficial",
    AlunoOficial: "Aluno Oficial",
    SubTenente: "Subtenente",
    PrimeiroSargento: "1º Sargento",
    SegundoSargento: "2º Sargento",
    TerceiroSargento: "3º Sargento",
    AlunoSargento: "Aluno Sargento",
    Cabo: "Cabo",
    Soldado: "Soldado",
    Civil: "Civil",
    Outros: "Outros"
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const body = {
        nomePessoa: values.name ?? "",
        documentoPessoa: values.documento ?? "",
        placaPessoa: values.placa ?? "",
      };

      const res = await fetchPessoas(body);

      if (res.success) {
        setPessoasEncontradas(res.pessoas || []);
      } else {
        setPessoasEncontradas([]);
      }
      } catch (error) {
      console.error("Erro ao buscar pessoa:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Search className="mr-2 h-4 w-4" />
          Buscar Pessoas/Veículos
      </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buscar Pessoas/Veículos</DialogTitle>
          <DialogDescription>
            Buscar por RE/CPF, Nome ou Placa de Veículo.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          {pessoasEncontradas.length > 0 ? (
            <div className="space-y-4">
            <h3 className="text-lg font-semibold">Resultados Encontrados:</h3>

            <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
              {pessoasEncontradas.map((pessoa) => (
                <div
                  key={pessoa.id}
                  className="border p-3 rounded-md flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{pessoa.nome}</p>
                    <p className="text-sm text-muted-foreground">
                      RE/CPF: {pessoa.documento}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Posto/Graduação: {patenteLabelMap[pessoa.patente] || pessoa.patente}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Unidade: {pessoa.unidade}
                    </p>
                  </div>
                  <div className="flex flex-row gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEditarPessoaClick(pessoa)}
                  >
                      Editar
                  </Button>

                  <Button size="sm" onClick={() => onSelecionarPessoaClick(pessoa)}>
                    Selecionar
                  </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-row gap-2">
            <Button variant="outline" onClick={handleNovaBusca}>
              Nova Busca
            </Button>
            <Button
              onClick={() => {
                setOpen(false); // Fecha o Dialog atual (de busca)
                setTimeout(() => {
                  onNovaPessoaClick(); // Abre o de registro
                }, 200); // Aguarda animação do dialog fechar
              }}
            >
              Registrar Nova Pessoa
            </Button>
            </div>
          </div>
          ) : (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Tipo de busca */}
              <FormField
                control={form.control}
                name="tipoBusca"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Buscar por</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setTipoBusca(value as "documento" | "name" | "placa");
                        }}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Escolha o tipo de busca" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="documento">RE/CPF</SelectItem>
                          <SelectItem value="name">Nome</SelectItem>
                          <SelectItem value="placa">Placa</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Campos dinâmicos */}
              {tipoBusca === "documento" && (
                <FormField
                  control={form.control}
                  name="documento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xl">RE / CPF</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123456 ou 12345678910"
                          {...field}
                          inputMode="numeric"
                          pattern="[0-9]*"
                          onChange={(e) => {
                            const onlyNums = e.target.value.replace(/\D/g, "");
                            field.onChange(onlyNums);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {tipoBusca === "name" && (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xl">Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="João da Silva" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {tipoBusca === "placa" && (
                <FormField
                  control={form.control}
                  name="placa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xl">Placa do Veículo</FormLabel>
                      <FormControl>
                        <Input placeholder="AAA-1234 ou AAA-1A23" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Button type="submit">Buscar</Button>
            </form>
          )}
        </Form>
      </DialogContent>
    </Dialog>
  );
}
