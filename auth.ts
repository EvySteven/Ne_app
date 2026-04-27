import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { PrismaClient } from '@/lib/generated/prisma'
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
                try {
                    if (!credentials?.email || !credentials?.motDePasse) {
                        console.log('❌ Email ou mot de passe manquant')
                        return null
                    }
                    
                    console.log(`🔍 Recherche utilisateur: ${credentials.email}`)
                    const user = await prisma.utilisatrice.findUnique({
                        where: { email: credentials.email as string }
                    })
                    
                    if (!user) {
                        console.log(`❌ Utilisateur non trouvé: ${credentials.email}`)
                        return null
                    }
                    
                    console.log(`✓ Utilisateur trouvé: ${user.pseudo}`)
                    console.log(`🔐 Vérification du mot de passe...`)
                    
                    const valide = await bcrypt.compare(
                        credentials.motDePasse as string,
                        user.password
                    )
                    
                    if (!valide) {
                        // Support temporaire pour les comptes importés avec mot de passe en clair
                        if (credentials.motDePasse === user.password) {
                            console.log(`⚠ Mot de passe stocké en clair détecté pour ${credentials.email}, mise à jour vers un hash sécurisé.`)
                            const hashed = await bcrypt.hash(credentials.motDePasse as string, 12)
                            await prisma.utilisatrice.update({
                                where: { email: credentials.email as string },
                                data: { password: hashed }
                            })
                        } else {
                            console.log(`❌ Mot de passe incorrect pour: ${credentials.email}`)
                            return null
                        }
                    }
                    
                    console.log(`✅ Authentification réussie: ${user.pseudo}`)
                    return { id: user.id, name: user.pseudo, email: user.email }
                } catch (error) {
                    console.error('❌ Erreur d\'authentification:', error)
                    return null
                }
            },
        })
    ],
    pages: {
        signIn: '/connexion',
        error: '/connexion', // Redirect errors to login page
    },
})