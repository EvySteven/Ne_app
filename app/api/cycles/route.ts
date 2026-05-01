// Fichier : app/api/cycles/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { predire } from '@/lib/prediction'

// GET : Récupérer les cycles de l'utilisatrice et calculer les prédictions
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      console.log('Session non trouvée ou utilisateur non authentifié')
      return NextResponse.json({ 
        erreur: 'Non autorisé - Veuillez vous reconnecter' 
      }, { status: 401 })
    }

    const cycles = await prisma.cycle.findMany({
      where: { userId: session.user.id },
      orderBy: { dateDebut: 'desc' }
    })

    if (cycles.length === 0) {
      return NextResponse.json({
        cycles: [],
        prediction: null,
        message: 'Aucun cycle enregistré. Commence par ajouter ton premier cycle.'
      })
    }

    // Calculer les longueurs de cycles
    const longueursCycles: number[] = []
    const dureesRegles: number[] = []

    for (let i = 0; i < cycles.length - 1; i++) {
      const cycleActuel = cycles[i]
      const cycleSuivant = cycles[i + 1]

      if (cycleActuel.dateFin && cycleSuivant.dateDebut) {
        const longueur = Math.round((cycleSuivant.dateDebut.getTime() - cycleActuel.dateFin.getTime()) / (1000 * 60 * 60 * 24))
        if (longueur > 0 && longueur < 100) { // Filtrer les valeurs aberrantes
          longueursCycles.push(longueur)
        }
      }

      if (cycleActuel.dureeJours) {
        dureesRegles.push(cycleActuel.dureeJours)
      }
    }

    // Ajouter le dernier cycle si terminé
    if (cycles[0].dureeJours) {
      dureesRegles.push(cycles[0].dureeJours)
    }

    // Calculer la prédiction
    const dernierCycle = cycles[0]
    const prediction = predire(longueursCycles, dernierCycle.dateDebut, dureesRegles)

    return NextResponse.json({
      cycles: cycles.map(c => ({
        id: c.id,
        dateDebut: c.dateDebut,
        dateFin: c.dateFin,
        dureeJours: c.dureeJours
      })),
      prediction
    })

  } catch (erreur) {
    console.error('Erreur GET cycles:', erreur)
    return NextResponse.json(
      { erreur: 'Erreur lors de la récupération des cycles' },
      { status: 500 }
    )
  }
}

// POST : Ajouter un nouveau cycle
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ erreur: 'Non autorisé' }, { status: 401 })
    }

    const { dateDebut, dateFin, dureeJours } = await request.json()

    if (!dateDebut) {
      return NextResponse.json(
        { erreur: 'La date de début est obligatoire' },
        { status: 400 }
      )
    }

    const nouveauCycle = await prisma.cycle.create({
      data: {
        userId: session.user.id,
        dateDebut: new Date(dateDebut),
        dateFin: dateFin ? new Date(dateFin) : null,
        dureeJours: dureeJours ? parseInt(dureeJours) : null
      }
    })

    return NextResponse.json({
      message: 'Cycle ajouté avec succès',
      cycle: nouveauCycle
    }, { status: 201 })

  } catch (erreur) {
    console.error('Erreur POST cycle:', erreur)
    return NextResponse.json(
      { erreur: 'Erreur lors de l\'ajout du cycle' },
      { status: 500 }
    )
  }
}