import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Vérifier les variables d'environnement
console.log('🔍 Vérification des variables d\'environnement:')
console.log('DATABASE_URL:', !!process.env.DATABASE_URL ? '✅ Configuré' : '❌ MANQUANT')
console.log('NEXTAUTH_SECRET:', !!process.env.NEXTAUTH_SECRET ? '✅ Configuré' : '❌ MANQUANT')
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL || '❌ MANQUANT')

// Test de connexion
async function testConnection() {
  try {
    await prisma.$connect()
    console.log('✅ Connexion Prisma établie')
  } catch (error) {
    console.error('❌ Erreur de connexion Prisma:', error)
  }
}

testConnection()

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
                        console.log('ERREUR: Email ou mot de passe manquant')
                        return null
                    }
                    
                    console.log(`Recherche utilisateur: ${credentials.email}`)
                    console.log(`Mot de passe reçu: ${credentials.motDePasse}`)
                    
                    let user = null
                    try {
                        user = await prisma.utilisatrice.findUnique({
                            where: { email: credentials.email as string }
                        })
                        console.log(`Résultat recherche:`, user ? 'Utilisateur trouvé' : 'Utilisateur non trouvé')
                    } catch (dbError) {
                        console.error('ERREUR BDD lors de la recherche:', dbError)
                    }
                    
                    if (!user) {
                        console.log(`INFO: Utilisateur non trouvé, création automatique: ${credentials.email}`)
                        
                        // Créer automatiquement l'utilisateur
                        const hashedPassword = await bcrypt.hash(credentials.motDePasse as string, 12)
                        console.log(`Mot de passe hashé créé`)
                        
                        try {
                            user = await prisma.utilisatrice.create({
                                data: {
                                    email: credentials.email as string,
                                    pseudo: (credentials.email as string).split('@')[0], // Utiliser la partie avant @ comme pseudo
                                    password: hashedPassword
                                }
                            })
                            console.log(`SUCCÈS: Utilisateur créé: ${user.pseudo} (ID: ${user.id})`)
                        } catch (createError) {
                            console.error('ERREUR BDD lors de la création:', createError)
                            return null
                        }
                    }
                    
                    console.log(`Utilisateur trouvé: ${user.pseudo}`)
                    console.log(`Vérification du mot de passe...`)
                    
                    const valide = await bcrypt.compare(
                        credentials.motDePasse as string,
                        user.password
                    )
                    
                    if (!valide) {
                        // Support temporaire pour les comptes importés avec mot de passe en clair
                        if (credentials.motDePasse === user.password) {
                            console.log(`ATTENTION: Mot de passe stocké en clair détecté pour ${credentials.email}, mise à jour vers un hash sécurisé.`)
                            const hashed = await bcrypt.hash(credentials.motDePasse as string, 12)
                            await prisma.utilisatrice.update({
                                where: { email: credentials.email as string },
                                data: { password: hashed }
                            })
                        } else {
                            console.log(`ERREUR: Mot de passe incorrect pour: ${credentials.email}`)
                            return null
                        }
                    }
                    
                    console.log(`SUCCÈS: Authentification réussie: ${user.pseudo}`)
                    return { id: user.id, name: user.pseudo, email: user.email }
                } catch (error) {
                    console.error('ERREUR: Erreur d\'authentification:', error)
                    return null
                }
            },
        })
    ],
    pages: {
        signIn: '/connexion',
        error: '/connexion', // Redirect errors to login page
    },
    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60, // 24 hours
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (token.id) {
                session.user.id = token.id as string
            }
            return session
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
})