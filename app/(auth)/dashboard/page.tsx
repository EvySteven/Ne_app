'use client'

import { useEffect, useState } from 'react'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Navigation } from '@/components/navigation'
import { Calendar, Plus, BookOpen } from 'lucide-react'

interface Cycle {
  id: string
  dateDebut: string
  dateFin: string | null
  dureeJours: number | null
}

interface Prediction {
  dateEstimee: string
  dateEstimeeFin: string
  dureeEstimee: number
  dureeReglesEstimee: number
  ovulationEstimee: string
  fenetreOvulationDebut: string
  fenetreOvulationFin: string
  fenetreFertileDebut: string
  fenetreFertileFin: string
  profil: 'regulier' | 'semi' | 'irregulier'
  sigma: number
  message: string
}

export default function DashboardPage() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAddCycle, setShowAddCycle] = useState(false)
  const [newCycle, setNewCycle] = useState({
    dateDebut: '',
    dateFin: '',
    dureeJours: ''
  })

  useEffect(() => {
    fetchCycles()
  }, [])

  const fetchCycles = async () => {
    console.log('🔄 Début fetchCycles')
    try {
      const response = await fetch('/api/cycles')
      console.log('📡 Response status:', response.status)
      const data = await response.json()
      console.log('📦 Response data:', data)
      
      if (response.ok) {
        setCycles(data.cycles || [])
        setPrediction(data.prediction)
        if (data.message) {
          console.log('Message API:', data.message)
        }
      } else {
        console.error('Erreur API cycles:', data.erreur)
        // Afficher un message à l'utilisateur
        if (data.erreur?.includes('Non autorisé')) {
          alert('Veuillez vous reconnecter pour accéder à vos cycles.')
        } else {
          alert('Erreur lors du chargement des cycles: ' + data.erreur)
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error)
      alert('Erreur de connexion. Vérifiez votre connexion internet.')
    } finally {
      console.log('✅ Fin fetchCycles, setLoading(false)')
      setLoading(false)
    }
  }

  const handleAddCycle = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/cycles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCycle)
      })
      const data = await response.json()
      
      if (response.ok) {
        setNewCycle({ dateDebut: '', dateFin: '', dureeJours: '' })
        setShowAddCycle(false)
        fetchCycles() // Recharger les données
        alert('Cycle ajouté avec succès !')
      } else {
        console.error('Erreur ajout cycle:', data.erreur)
        if (data.erreur?.includes('Non autorisé')) {
          alert('Veuillez vous reconnecter pour ajouter un cycle.')
        } else {
          alert('Erreur lors de l\'ajout: ' + data.erreur)
        }
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error)
      alert('Erreur de connexion. Vérifiez votre connexion internet.')
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR')
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#FFF8F0]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C2185B] mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de ton tableau de bord...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#FFF8F0]">
      <Navigation />
      <div className="max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#C2185B]">Mon Tableau de Bord</h1>
          <Button
            onClick={() => signOut()}
            variant="outline"
            className="border-[#C2185B] text-[#C2185B] hover:bg-[#C2185B] hover:text-white"
          >
            Déconnexion
          </Button>
        </div>

        {/* Prédiction */}
        {prediction && (
          <Card className="p-6 mb-8 bg-white border-[#C2185B]/20">
            <h2 className="text-xl font-semibold text-[#C2185B] mb-4 flex items-center gap-2"><Calendar className="w-5 h-5" /> Prochaines Règles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Date estimée</p>
                <p className="font-semibold">{formatDate(prediction.dateEstimee)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Durée estimée</p>
                <p className="font-semibold">{prediction.dureeReglesEstimee} jours</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Profil</p>
                <p className="font-semibold capitalize">{prediction.profil}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Ovulation estimée</p>
                <p className="font-semibold">{formatDate(prediction.ovulationEstimee)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Période fertile</p>
                <p className="font-semibold">
                  {formatDate(prediction.fenetreFertileDebut)} - {formatDate(prediction.fenetreFertileFin)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fiabilité</p>
                <p className="font-semibold">σ = {prediction.sigma}</p>
              </div>
            </div>
            <p className="mt-4 text-gray-700 italic">{prediction.message}</p>
          </Card>
        )}

        {/* Ajouter un cycle */}
        <Card className="p-6 mb-8 bg-white border-[#C2185B]/20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#C2185B] flex items-center gap-2"><Plus className="w-5 h-5" /> Ajouter un Cycle</h2>
            <Button
              onClick={() => setShowAddCycle(!showAddCycle)}
              variant="outline"
              size="sm"
            >
              {showAddCycle ? 'Annuler' : 'Ajouter'}
            </Button>
          </div>

          {showAddCycle && (
            <form onSubmit={handleAddCycle} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de début *
                  </label>
                  <Input
                    type="date"
                    value={newCycle.dateDebut}
                    onChange={(e) => setNewCycle({...newCycle, dateDebut: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de fin
                  </label>
                  <Input
                    type="date"
                    value={newCycle.dateFin}
                    onChange={(e) => setNewCycle({...newCycle, dateFin: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Durée (jours)
                  </label>
                  <Input
                    type="number"
                    value={newCycle.dureeJours}
                    onChange={(e) => setNewCycle({...newCycle, dureeJours: e.target.value})}
                    placeholder="5"
                  />
                </div>
              </div>
              <Button type="submit" className="bg-[#C2185B] hover:bg-[#A0154A]">
                Enregistrer le cycle
              </Button>
            </form>
          )}
        </Card>

        {/* Historique des cycles */}
        <Card className="p-6 bg-white border-[#C2185B]/20">
          <h2 className="text-xl font-semibold text-[#C2185B] mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5" /> Historique des Cycles</h2>
          {cycles.length === 0 ? (
            <p className="text-gray-600">Aucun cycle enregistré. Commence par ajouter ton premier cycle !</p>
          ) : (
            <div className="space-y-3">
              {cycles.map((cycle) => (
                <div key={cycle.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">
                      Du {formatDate(cycle.dateDebut)}
                      {cycle.dateFin && ` au ${formatDate(cycle.dateFin)}`}
                    </p>
                    {cycle.dureeJours && (
                      <p className="text-sm text-gray-600">Durée : {cycle.dureeJours} jours</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </main>
  )
}
