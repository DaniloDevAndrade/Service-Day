'use server'

import { Prisma } from "@/generated/prisma"
import { compareSync } from "bcrypt-ts"
import { prisma } from "../../../database/db"
import { UserSchemaLogin } from "../zod/UserSchemaLogin"

type UserLogin = {
    name: string
    email: string
}

export async function RequestLogin(credentials: Partial<Record<'email' | 'password', unknown>>): Promise<UserLogin | null>{
    const {email, password} = UserSchemaLogin.parse(credentials)

    const where: Prisma.UsuariosWhereInput = {}

    if(email) where.email = {contains: email, mode: 'insensitive'}

    const FindUser = await prisma.usuarios.findFirst({where})
    if(!FindUser) return null

    const ComparePassword = compareSync(password, FindUser.password)
    if(!ComparePassword) return null

    const user = {email: FindUser.email, name: FindUser.nome}
    return user
}