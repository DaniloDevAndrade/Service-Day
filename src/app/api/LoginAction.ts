'use server'

import { redirect } from "next/navigation"
import { signIn } from "../../../auth"

type BodyLogin = {
    email: string,
    password: string
}

export default async function loginAction(body: BodyLogin) {
    try {
        await signIn("credentials", {
            email: body.email,
            password: body.password,
            redirect: false
        })
    } catch (error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        if(error.type === "CredentialsSignin"){
            return {success: false, message: 'Dados de login incorretos!'}
        }
        return {success: false, message: 'Ops algum erro aconteceu!'}
    }
    redirect('/entryandexit')
}