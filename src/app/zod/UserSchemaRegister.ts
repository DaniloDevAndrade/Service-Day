import z from "zod";

export const UserSchemaRegister = z.object({
    nome: z.string().min(3, { message: 'Nome completo deve ter pelo menos 3 caracteres' }).nonempty('Nome é obrigatório'),
    phone: z.string().nonempty('Telefone é obrigatório').min(11, { message: 'Precisa ter no minimo 11 caracteres' }),
    email: z.string().nonempty('Email é obrigatório').email({ message: 'E-mail inválido. Use o formato email@email.com' }),
    password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres' }),
});