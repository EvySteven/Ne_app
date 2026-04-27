// Fichier : app/api/journaux/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/lib/generated/prisma'
import { auth } from '@/auth'

const prisma = new PrismaClient()

// GET : Récupérer les journaux de l'utilisatrice
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ erreur: 'Non autorisé' }, { status: 401 })
    }

    const journaux = await prisma.journal.findMany({
      where: { userId: session.user.id },
      orderBy: { date: 'desc' }
    })

    return NextResponse.json({
      journaux: journaux.map(j => ({
        id: j.id,
        date: j.date,
        flux: j.flux,
        douleur: j.douleur,
        humeur: j.humeur,
        energie: j.energie,
        sommeil: j.sommeil,
        noteLibre: j.noteLibre
      }))
    })

  } catch (erreur) {
    console.error('Erreur GET journaux:', erreur)
    return NextResponse.json(
      { erreur: 'Erreur lors de la récupération des journaux' },
      { status: 500 }
    )
  }
}

// POST : Ajouter une entrée de journal
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ erreur: 'Non autorisé' }, { status: 401 })
    }

    const { date, flux, douleur, humeur, energie, sommeil, noteLibre } = await request.json()

    if (!date) {
      return NextResponse.json(
        { erreur: 'La date est obligatoire' },
        { status: 400 }
      )
    }

    const nouvelleEntree = await prisma.journal.create({
      data: {
        userId: session.user.id,
        date: new Date(date),
        flux: flux || null,
        douleur: douleur ? parseInt(douleur) : null,
        humeur: humeur || null,
        energie: energie ? parseInt(energie) : null,
        sommeil: sommeil ? parseInt(sommeil) : null,
        noteLibre: noteLibre || null
      }
    })

    return NextResponse.json({
      message: 'Entrée ajoutée avec succès',
      journal: nouvelleEntree
    }, { status: 201 })

  } catch (erreur) {
    console.error('Erreur POST journal:', erreur)
    return NextResponse.json(
      { erreur: 'Erreur lors de l\'ajout de l\'entrée' },
      { status: 500 }
    )
  }
}