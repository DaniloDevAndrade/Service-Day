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
    .regex(/^[0-9]{2}BPMM\s[0-9]{3}\/[0-9]{3}\/[0-9]{2}$/, {
      message: "Formato inválido. Ex: 33BPMM 123/010/25",
    }),
  reResponsavel: z.string().regex(/^[0-9]{6}-[0-9]{1}$/, {
    message: "Formato inválido. Ex: 123456-7",
  }),
  nomeGuerra: z
    .string()
    .regex(
      /^(SD|CB|3º SGT|2º SGT|1º SGT|ST|ASP OF|2º TEN|1º TEN|CAP|MAJ|TC|CEL)\sPM\s[A-Z][a-z]+$/,
      {
        message: "Formato inválido. Ex: 2º TEN PM Silva ou 3º SGT PM Souza",
      }
    ),
  horaInicio: z.string().min(1, "Hora de início obrigatória"),
  horaFim: z.string().min(1, "Hora de término obrigatória"),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  open: boolean;
  setOpen: (value: boolean) => void;
  onConfirmar: (dados: FormValues) => void;
};

export default function DialogRelatorioVeiculos({
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
    onConfirmar(values);
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
