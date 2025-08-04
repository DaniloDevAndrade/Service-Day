import { RequestLogin } from "@/app/api/RequestLogin"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials:{
                email: {},
                password: {}
            },
            authorize: async (credentials) =>{
                const user = await RequestLogin(credentials)
                return user
            },
        })
    ],
    session: {
        maxAge: 13*60*60 //13 hours
    },
    trustHost: true,
    secret: process.env.AUTH_SECRET,
    pages: {
        signIn: "/auth/signin",
      }
})