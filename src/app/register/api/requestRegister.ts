'use server'
import { hashSync } from 'bcrypt-ts'
import { prisma } from "../../../../database/db"
import { Prisma } from '@/generated/prisma'
import { UserSchemaRegister } from '@/app/zod/UserSchemaRegister'

type body = {
    nome: string
    email: string
    password: string
    phone: string
}
type returnRequest = {
    created?: boolean
    errorEmail?: boolean
    error?: {
        message: string
    }
    registerNewBusiness?: object
}

export async function requestRegister(body: body): Promise<returnRequest>{
    try {
        const UserBody = UserSchemaRegister.parse(body)
        UserBody.password = hashSync(body.password, 10)

        
        const where: Prisma.UsuariosWhereInput = {}
        if(body.email) where.email = {contains: body.email, mode: 'insensitive'}

        const FindUser = await prisma.usuarios.findFirst({where})
        if(FindUser) return {errorEmail: true, error:{message: "Email já cadastrado!"}}

        await prisma.usuarios.create({
             data: UserBody
        })
            
        return {created: true}
    } catch (err) {
        return {created: false, error:{message: err as string}}
    }
}