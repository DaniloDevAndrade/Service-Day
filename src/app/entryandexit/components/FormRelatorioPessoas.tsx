"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  numeroParte: z
    .string()
    .regex(/^[0-9]{2}bpm{1}m\s[0-9]{3}\/[0-9]{3}\/[0-9]{2}$/i, {
      message: "Formato inválido. Ex: 33BPMM 123/010/25",
    }),
  reResponsavel: z.string().regex(/^[0-9]{6}-[0-9]{1}$/, {
    message: "Formato inválido. Ex: 123456-7",
  }),
  nomeGuerra: z.string().min(3, "Nome de guerra obrigatório"),
  horaInicio: z.string().min(1, "Hora de início obrigatória"),
  horaFim: z.string().min(1, "Hora de término obrigatória"),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  open: boolean;
  setOpen: (value: boolean) => void;
  onConfirmar: (dados: FormValues) => void;
};

export default function DialogRelatorioPessoas({
  open,
  setOpen,
  onConfirmar,
}: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numeroParte: "",
      reResponsavel: "",
      nomeGuerra: "",
      horaInicio: "",
      horaFim: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    // Formatar nome de guerra
    const partes = values.nomeGuerra.trim().split(/\s+/);
    const patente = partes.slice(0, -1).join(" ").toUpperCase();
    const nome = partes.at(-1)?.toLowerCase();
    const nomeFormatado = nome
      ? nome.charAt(0).toUpperCase() + nome.slice(1)
      : "";
    const nomeGuerraFormatado = `${patente} ${nomeFormatado}`;

    // Formatar número da parte
    const numeroParteFormatado = values.numeroParte.toUpperCase();

    onConfirmar({
      ...values,
      numeroParte: numeroParteFormatado,
      nomeGuerra: nomeGuerraFormatado,
    });

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gerar Relatório de Pessoas</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="numeroParte"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número da Parte</FormLabel>
                  <FormControl>
                    <Input placeholder="33BPMM 123/010/25" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reResponsavel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RE do Responsável</FormLabel>
                  <FormControl>
                    <Input placeholder="123456-7" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nomeGuerra"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome de Guerra</FormLabel>
                  <FormControl>
                    <Input placeholder="SD PM Stive" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="horaInicio"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Hora de Início</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="horaFim"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Hora de Término</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full">
              Gerar PDF
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
