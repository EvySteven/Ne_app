import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials:{
                email: { label: 'Email', type: 'email' },
                motDePasse: { label: 'Mot de passe', type: 'password' },
            },
            authorize: async (credentials) => {
                if (!credentials?.email || !credentials?.motDePasse) return null
                const user = await prisma.utilisatrice.findUnique({
                    where: { email: credentials.email as string }
                })
                if (!user) return null
                const valide = await bcrypt.compare(
                    credentials.motDePasse as string,
                    user.password
                )
                if (!valide) return null
                return { id: user.id, name: user.pseudo, email: user.email }
            },
        })
    ],
    pages: {
        signIn: '/connexion',
    },
})