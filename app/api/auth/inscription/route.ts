// Fichier : app/api/auth/inscription/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/lib/generated/prisma'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // 1. Lire les données envoyées par le frontend
    const { pseudo, email, password } = await request.json()

    // 2. Vérifier que tous les champs sont remplis
    if (!pseudo || !email || !password) {
      return NextResponse.json(
        { erreur: 'Tous les champs sont obligatoires' },
        { status: 400 }
      )
    }

    // 3. Vérifier que l'email n'existe pas déjà
    const existeDeja = await prisma.utilisatrice.findUnique({
      where: { email }
    })
    if (existeDeja) {
      return NextResponse.json(
        { erreur: 'Cet email est déjà utilisé' },
        { status: 409 }
      )
    }

    // 4. Hasher le mot de passe — jamais stocker en clair !
    const passwordHashe = await bcrypt.hash(password, 12)

    // 5. Créer l'utilisatrice dans la base de données
    const nouvelle = await prisma.utilisatrice.create({
      data: { pseudo, email, password: passwordHashe }
    })

    // 6. Répondre avec succès
    return NextResponse.json(
      { message: `Bienvenue ${pseudo} ! Ton compte est prêt. 🌸`, id: nouvelle.id },
      { status: 201 }
    )

  } catch (erreur) {
    return NextResponse.json(
      { erreur: 'Oups ! Quelque chose a mal tourné de notre côté.' },
      { status: 500 }
    )
  }
}