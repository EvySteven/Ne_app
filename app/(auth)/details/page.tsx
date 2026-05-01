'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Navigation } from '@/components/navigation'
import { Edit, BookOpen, Droplets, Waves, Battery, BatteryLow, Zap, Moon, HelpCircle } from 'lucide-react'

interface JournalEntry {
  id: string
  date: string
  flux: string | null
  douleur: number | null
  humeur: string | null
  energie: number | null
  sommeil: number | null
  noteLibre: string | null
}

export default function DetailsPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddEntry, setShowAddEntry] = useState(false)
  const [newEntry, setNewEntry] = useState({
    date: new Date().toISOString().split('T')[0],
    flux: '',
    douleur: '',
    humeur: '',
    energie: '',
    sommeil: '',
    noteLibre: ''
  })

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/journaux')
      const data = await response.json()
      if (response.ok) {
        setEntries(data.journaux)
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/journaux', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry)
      })
      if (response.ok) {
        setNewEntry({
          date: new Date().toISOString().split('T')[0],
          flux: '',
          douleur: '',
          humeur: '',
          energie: '',
          sommeil: '',
          noteLibre: ''
        })
        setShowAddEntry(false)
        fetchEntries() // Recharger les données
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getFluxEmoji = (flux: string | null) => {
    switch (flux) {
      case 'faible': return <Droplets className="w-4 h-4 text-blue-500" />
      case 'moyen': return <Waves className="w-4 h-4 text-blue-600" />
      case 'fort': return <div className="flex"><Waves className="w-4 h-4 text-blue-700" /><Waves className="w-4 h-4 text-blue-700 -ml-1" /></div>
      case 'tres-fort': return <div className="flex"><Waves className="w-4 h-4 text-blue-800" /><Waves className="w-4 h-4 text-blue-800 -ml-1" /><Waves className="w-4 h-4 text-blue-800 -ml-1" /></div>
      default: return <HelpCircle className="w-4 h-4 text-gray-400" />
    }
  }

  const getDouleurLevel = (douleur: number | null) => {
    if (!douleur) return 'Aucune'
    if (douleur <= 2) return 'Légère'
    if (douleur <= 5) return 'Modérée'
    if (douleur <= 7) return 'Forte'
    return 'Très forte'
  }

  const getEnergieEmoji = (energie: number | null) => {
    if (!energie) return <HelpCircle className="w-4 h-4 text-gray-400" />
    if (energie >= 8) return <Zap className="w-4 h-4 text-yellow-500" />
    if (energie >= 6) return <Battery className="w-4 h-4 text-green-500" />
    if (energie >= 4) return <BatteryLow className="w-4 h-4 text-orange-500" />
    return <Moon className="w-4 h-4 text-purple-500" />
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#FFF8F0]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C2185B] mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de ton journal...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#FFF8F0]">
      <Navigation />
      <div className="max-w-4xl mx-auto p-4">
        {/* Ajouter une entrée */}
        <Card className="p-6 mb-8 bg-white border-[#C2185B]/20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#C2185B] flex items-center gap-2"><Edit className="w-5 h-5" /> Ajouter une entrée</h2>
            <Button
              onClick={() => setShowAddEntry(!showAddEntry)}
              variant="outline"
              size="sm"
            >
              {showAddEntry ? 'Annuler' : 'Ajouter'}
            </Button>
          </div>

          {showAddEntry && (
            <form onSubmit={handleAddEntry} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <Input
                    type="date"
                    value={newEntry.date}
                    onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Flux
                  </label>
                  <select
                    value={newEntry.flux}
                    onChange={(e) => setNewEntry({...newEntry, flux: e.target.value})}
                    className="w-full h-7 rounded-md border border-input bg-input/20 px-2 py-0.5 text-sm"
                  >
                    <option value="">Sélectionner</option>
                    <option value="faible">Faible</option>
                    <option value="moyen">Moyen</option>
                    <option value="fort">Fort</option>
                    <option value="tres-fort">Très fort</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Douleur (1-10)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={newEntry.douleur}
                    onChange={(e) => setNewEntry({...newEntry, douleur: e.target.value})}
                    placeholder="5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Humeur
                  </label>
                  <Input
                    value={newEntry.humeur}
                    onChange={(e) => setNewEntry({...newEntry, humeur: e.target.value})}
                    placeholder="Comment te sens-tu ?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Énergie (1-10)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={newEntry.energie}
                    onChange={(e) => setNewEntry({...newEntry, energie: e.target.value})}
                    placeholder="8"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sommeil (1-10)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={newEntry.sommeil}
                    onChange={(e) => setNewEntry({...newEntry, sommeil: e.target.value})}
                    placeholder="7"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note libre
                </label>
                <textarea
                  value={newEntry.noteLibre}
                  onChange={(e) => setNewEntry({...newEntry, noteLibre: e.target.value})}
                  placeholder="Écris ce que tu veux partager..."
                  className="w-full h-20 rounded-md border border-input bg-input/20 px-2 py-1 text-sm resize-none"
                />
              </div>
              <Button type="submit" className="bg-[#C2185B] hover:bg-[#A0154A]">
                Enregistrer l'entrée
              </Button>
            </form>
          )}
        </Card>

        {/* Historique des entrées */}
        <Card className="p-6 bg-white border-[#C2185B]/20">
          <h2 className="text-xl font-semibold text-[#C2185B] mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5" /> Mes entrées</h2>
          {entries.length === 0 ? (
            <p className="text-gray-600">Aucune entrée dans ton journal. Commence par en ajouter une !</p>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <Card key={entry.id} className="p-4 bg-gray-50 border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-[#C2185B]">{formatDate(entry.date)}</h3>
                    <div className="flex items-center space-x-2 text-sm">
                      {entry.flux && <span>{getFluxEmoji(entry.flux)}</span>}
                      {entry.energie && <span>{getEnergieEmoji(entry.energie)}</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mb-3">
                    {entry.flux && (
                      <div>
                        <span className="text-gray-600">Flux:</span> {entry.flux}
                      </div>
                    )}
                    {entry.douleur && (
                      <div>
                        <span className="text-gray-600">Douleur:</span> {getDouleurLevel(entry.douleur)}
                      </div>
                    )}
                    {entry.humeur && (
                      <div>
                        <span className="text-gray-600">Humeur:</span> {entry.humeur}
                      </div>
                    )}
                    {entry.energie && (
                      <div>
                        <span className="text-gray-600">Énergie:</span> {entry.energie}/10
                      </div>
                    )}
                    {entry.sommeil && (
                      <div className="col-span-2 md:col-span-1">
                        <span className="text-gray-600">Sommeil:</span> {entry.sommeil}/10
                      </div>
                    )}
                  </div>

                  {entry.noteLibre && (
                    <p className="text-gray-700 italic">"{entry.noteLibre}"</p>
                  )}
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>
    </main>
  )
}