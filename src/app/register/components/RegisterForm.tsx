"use client"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import LoadingConfirmation from "./ButtonLoading";
import { requestRegister } from "../api/requestRegister";
import { useRouter } from "next/navigation";
// import { useRouter } from "next/navigation";

const formSchema = z.object({
    name: z.string().min(3, { message: 'Nome completo deve ter pelo menos 3 caracteres' }),
    phone: z.string().refine(
      (value) => /^\(\d{2}\)\s?\d{5}-\d{4}$/.test(value),
      { message: 'Número de telefone inválido. Use o formato (DD)XXXXX-XXXX' }
    ),
    email: z
    .string()
    .email({ message: 'O e-mail deve ser institucional (@policiamilitar.sp.gov.br)' })
    .refine(
      (email) => email.endsWith('@policiamilitar.sp.gov.br'),
      { message: 'O e-mail deve ser institucional (@policiamilitar.sp.gov.br)' }
    ),
    password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
    confirmPassword: z.string().min(6, { message: 'Confirmação de senha deve ter pelo menos 6 caracteres' }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export default function RegisterForm(){
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error' | 'errorEmail'>('idle')
    const [loading, setLoading] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: '',
          phone: '',
          email: '',
          password: '',
          confirmPassword: '',
        },
      })

      function formatPhoneNumber(value: string) {
        const numbers = value.replace(/\D/g, '')
        if (numbers.length <= 2) return `(${numbers}`
        if (numbers.length <= 7) return `(${numbers.slice(0, 2)})${numbers.slice(2)}`
        return `(${numbers.slice(0, 2)})${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
      }

      const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true)
            const formattedValues = {...values, phone: formatPhoneNumber(values.phone).replace(/\D/g, '')}


            const body = {
              nome: formattedValues.name,
              email: formattedValues.email,
              password: formattedValues.confirmPassword,
              phone: formattedValues.phone,
          }

          console.log(body)

          const response = await requestRegister(body)

          if(response.created === false) {
            throw new Error(response.error?.message)
          }

          if(response.errorEmail === true) {
            setLoading(false)
            return setSubmissionStatus('errorEmail')
          }

          if(response.created === true){
            setIsLoading(false)
            setTimeout(()=>{
              router.push('/entryandexit')
            }, 1500)
          }

        } catch (error) {
            setSubmissionStatus('error')
            setLoading(false)
            console.log(error)
        }
        
      }
      
    return (
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col">
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
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xl">Telefone</FormLabel>
              <FormControl>
                <Input
                  placeholder="(11)99999-9999"
                  {...field}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value)
                    field.onChange(formatted)
                  }}
                  maxLength={14}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xl">E-mail Instuticional</FormLabel>
              <FormControl>
                <Input placeholder="stive@policiamilitar.sp.gov.br" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
              <FormItem>
                  <FormLabel className="text-xl">Senha</FormLabel>
                  <FormControl>
                      <Input
                          type="password"
                          placeholder="Digite sua senha"
                          {...field}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
          )}
      />

      <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
              <FormItem>
                  <FormLabel className="text-xl">Confirme sua Senha</FormLabel>
                  <FormControl>
                      <Input
                          type="password"
                          placeholder="Confirme sua senha"
                          {...field}
                      />
                  </FormControl>
                  <FormMessage />
              </FormItem>
          )}
      />
        {!loading ? (<Button type="submit">Registrar Usuario</Button>): 
        (<LoadingConfirmation isLoading={isLoading}></LoadingConfirmation>)}
        
      </form>
      {submissionStatus === 'error' && (
        <p className="mt-4 text-red-600">Erro ao registrar. Tente novamente.</p>
      )}
      {submissionStatus === 'errorEmail' && (
        <p className="mt-4 text-red-600">Email já registrado!</p>
      )}
    </Form>
    )
}