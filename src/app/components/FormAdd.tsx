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
import { Plus } from "lucide-react";
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
import createPessoa from "../api/createPessoa";

const patenteOptions: { label: string; value: string }[] = [
  { value: "Coronel", label: "Coronel" },
  { value: "TenenteCoronel", label: "Tenente-Coronel" },
  { value: "Major", label: "Major" },
  { value: "Capitao", label: "Capitão" },
  { value: "PrimeiroTenente", label: "1º Tenente" },
  { value: "SegundoTenente", label: "2º Tenente" },
  { value: "Aspirante", label: "Aspirante a Oficial" },
  { value: "AlunoOficial", label: "Aluno Oficial" },
  { value: "SubTenente", label: "Subtenente" },
  { value: "PrimeiroSargento", label: "1º Sargento" },
  { value: "SegundoSargento", label: "2º Sargento" },
  { value: "TerceiroSargento", label: "3º Sargento" },
  { value: "AlunoSargento", label: "Aluno Sargento" },
  { value: "Cabo", label: "Cabo" },
  { value: "Soldado", label: "Soldado" },
  { value: "Civil", label: "Civil" },
  { value: "Outros", label: "Outros" },
];

const veiculoSchema = z.object({
  placa: z.string().min(1, "Placa é obrigatória"),
  modelo: z.string().min(1, "Modelo é obrigatório"),
  cartao: z.string().min(1, "Cartão é obrigatório"),
});

const formSchema = z.object({
  name: z.string().min(3, { message: "Nome completo deve ter pelo menos 3 caracteres" }),
  documento: z.string().min(3, { message: "Documento deve ter pelo menos 3 caracteres" }),
  posto: z.enum(patenteOptions.map((opt) => opt.value) as [string, ...string[]]),
  unidade: z.string().min(3, { message: "Unidade deve ter pelo menos 3 caracteres" }),
  possuiVeiculo: z.enum(["sim", "nao"]),
  veiculo: z
    .array(veiculoSchema)
    .optional(),
}).refine((data) => {
  if (data.possuiVeiculo === "sim") {
    return data.veiculo && data.veiculo.length > 0 && data.veiculo.every((v) => 
      v.placa && v.modelo && v.cartao
    );
  }
  return true;
}, {
  path: ["veiculo"],
  message: "Todos os campos dos veículos são obrigatórios",
});

type FormAddProps = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

export default function FormAdd({ open, setOpen }: FormAddProps) {
  const [possuiVeiculo, setPossuiVeiculo] = useState<"sim" | "nao">("sim");
  const [quantidadeVeiculos, setQuantidadeVeiculos] = useState(1);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      documento: "",
      posto: "Soldado",
      unidade: "",
      possuiVeiculo: "sim",
      veiculo: Array(1).fill({ placa: "", modelo: "", cartao: "" }),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const response = await createPessoa({
        name: values.name,
        documento: values.documento,
        patente: values.posto,
        unidade: values.unidade,
        possuiVeiculo: values.possuiVeiculo,
        veiculo: values.possuiVeiculo === "sim" ? values.veiculo : [],
    });

    if (response.success) {
        form.reset(); // limpa os campos
        setQuantidadeVeiculos(1); // reseta quantidade de veículos
        setPossuiVeiculo("nao"); // reseta seleção
        setOpen(false); // fecha o Dialog
    } else {
        alert("Erro ao registrar: " + response.message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Registrar Pessoa
      </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar Nova Pessoa</DialogTitle>
          <DialogDescription>Registrar pessoas ao banco de dados</DialogDescription>
        </DialogHeader>

        <div className="max-h-[70vh] overflow-y-auto pr-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex flex-col">

              <FormField
                control={form.control}
                name="documento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RE / CPF</FormLabel>
                    <FormControl>
                      <Input placeholder="123456 ou 12345678910" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="João da Silva" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="posto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Posto / Graduação</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma patente" />
                        </SelectTrigger>
                        <SelectContent>
                          {patenteOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unidade</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 33º BPM/M" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="possuiVeiculo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Possui Veículo?</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          setPossuiVeiculo(value as "sim" | "nao");
                          field.onChange(value);
                          if (value === "nao") {
                            form.setValue("veiculo", []);
                          } else {
                            form.setValue("veiculo", Array(quantidadeVeiculos).fill({ placa: "", modelo: "", cartao: "" }));
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sim">Sim</SelectItem>
                          <SelectItem value="nao">Não</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Se SIM, escolher quantidade e preencher */}
              {possuiVeiculo === "sim" && (
                <>
                  <FormItem>
                    <FormLabel>Quantos veículos?</FormLabel>
                    <Select
                      value={quantidadeVeiculos.toString()}
                      onValueChange={(value) => {
                        const qtd = Number(value);
                        setQuantidadeVeiculos(qtd);
                        form.setValue("veiculo", Array(qtd).fill({ placa: "", modelo: "", cartao: "" }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a quantidade" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((num) => (
                          <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>

                  {form.watch("veiculo")?.map((_, index) => (
                    <div key={index} className="border p-3 rounded-lg space-y-4 bg-muted">
                      <h4 className="font-semibold">Veículo {index + 1}</h4>

                      <FormField
                        control={form.control}
                        name={`veiculo.${index}.placa`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Placa</FormLabel>
                            <FormControl>
                              <Input placeholder="AAA-1234" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`veiculo.${index}.modelo`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Modelo</FormLabel>
                            <FormControl>
                              <Input placeholder="Gol G7 / XRE 300" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`veiculo.${index}.cartao`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cartão</FormLabel>
                            <FormControl>
                              <Input placeholder="Nº do Cartão" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
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
