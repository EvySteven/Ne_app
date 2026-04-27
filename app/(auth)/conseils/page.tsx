'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Navigation } from '@/components/navigation'

const conseils = [
  {
    titre: "Comprendre ton cycle",
    contenu: "Ton cycle menstruel est unique. Enregistrer régulièrement tes dates de règles permet à l'application de calculer des prédictions plus précises.",
    categorie: "Éducation"
  },
  {
    titre: "Bien-être pendant les règles",
    contenu: "Pendant tes règles, privilégie le repos, une alimentation équilibrée et des activités douces. Écoute les signaux de ton corps.",
    categorie: "Santé"
  },
  {
    titre: "Période fertile",
    contenu: "La période fertile dure environ 6 jours par cycle. Si tu souhaites concevoir, c'est le moment optimal pour les rapports.",
    categorie: "Fertilité"
  },
  {
    titre: "Alimentation et cycle",
    contenu: "Une alimentation riche en fer, magnésium et vitamines B peut aider à réduire les symptômes prémenstruels.",
    categorie: "Nutrition"
  },
  {
    titre: "Sport et activité physique",
    contenu: "Le sport régulier peut aider à réduire les douleurs menstruelles et améliorer ton humeur pendant le cycle.",
    categorie: "Sport"
  },
  {
    titre: "Gestion du stress",
    contenu: "Le stress peut perturber ton cycle. Pratique la méditation, le yoga ou des techniques de relaxation.",
    categorie: "Bien-être"
  }
]

export default function ConseilsPage() {
  const [categorieSelectionnee, setCategorieSelectionnee] = useState<string>('Tous')

  const categories = ['Tous', ...Array.from(new Set(conseils.map(c => c.categorie)))]

  const conseilsFiltres = categorieSelectionnee === 'Tous'
    ? conseils
    : conseils.filter(c => c.categorie === categorieSelectionnee)

  return (
    <main className="min-h-screen bg-[#FFF8F0]">
      <Navigation />
      <div className="max-w-4xl mx-auto p-4">
        {/* Filtres par catégorie */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((categorie) => (
            <Button
              key={categorie}
              onClick={() => setCategorieSelectionnee(categorie)}
              variant={categorieSelectionnee === categorie ? "default" : "outline"}
              size="sm"
              className={categorieSelectionnee === categorie
                ? "bg-[#C2185B] hover:bg-[#A0154A]"
                : "border-[#C2185B] text-[#C2185B] hover:bg-[#C2185B] hover:text-white"
              }
            >
              {categorie}
            </Button>
          ))}
        </div>

        {/* Grille de conseils */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {conseilsFiltres.map((conseil, index) => (
            <Card key={index} className="p-6 bg-white border-[#C2185B]/20 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-[#C2185B]">{conseil.titre}</h3>
                <span className="text-xs bg-[#C2185B]/10 text-[#C2185B] px-2 py-1 rounded-full">
                  {conseil.categorie}
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed">{conseil.contenu}</p>
            </Card>
          ))}
        </div>

        {/* Section chatbot */}
        <Card className="p-6 mt-8 bg-white border-[#C2185B]/20 text-center">
          <h2 className="text-xl font-semibold text-[#C2185B] mb-3">🤖 Besoin d'aide personnalisée ?</h2>
          <p className="text-gray-600 mb-4">
            Anoushka, notre assistante IA, peut répondre à tes questions spécifiques sur la santé féminine.
          </p>
          <Link href="/chatbot">
            <Button className="bg-[#C2185B] hover:bg-[#A0154A]">
              Parler avec Anoushka
            </Button>
          </Link>
        </Card>
      </div>
    </main>
  )
}