'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Navigation } from '@/components/navigation'

interface Cycle {
  id: string
  dateDebut: string
  dateFin: string | null
  dureeJours: number | null
}

interface Prediction {
  dateEstimee: string
  dateEstimeeFin: string
  ovulationEstimee: string
  fenetreFertileDebut: string
  fenetreFertileFin: string
}

export default function CalendrierPage() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [prediction, setPrediction] = useState<Prediction | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    fetchCycles()
  }, [])

  const fetchCycles = async () => {
    try {
      const response = await fetch('/api/cycles')
      const data = await response.json()
      if (response.ok) {
        setCycles(data.cycles)
        setPrediction(data.prediction)
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const isCycleDay = (date: Date) => {
    return cycles.some(cycle => {
      const start = new Date(cycle.dateDebut)
      const end = cycle.dateFin ? new Date(cycle.dateFin) : null
      return date >= start && (!end || date <= end)
    })
  }

  const isPredictedPeriod = (date: Date) => {
    if (!prediction) return false
    const start = new Date(prediction.dateEstimee)
    const end = new Date(prediction.dateEstimeeFin)
    return date >= start && date <= end
  }

  const isOvulationDay = (date: Date) => {
    if (!prediction) return false
    const ovulation = new Date(prediction.ovulationEstimee)
    return date.toDateString() === ovulation.toDateString()
  }

  const isFertileDay = (date: Date) => {
    if (!prediction) return false
    const start = new Date(prediction.fenetreFertileDebut)
    const end = new Date(prediction.fenetreFertileFin)
    return date >= start && date <= end
  }

  const getDayClass = (date: Date | null) => {
    if (!date) return 'bg-gray-100'

    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()

    if (isCycleDay(date)) return 'bg-[#C2185B] text-white'
    if (isPredictedPeriod(date)) return 'bg-[#FF69B4] text-white'
    if (isOvulationDay(date)) return 'bg-[#FFD700] text-black'
    if (isFertileDay(date)) return 'bg-[#98FB98] text-black'
    if (isToday) return 'bg-[#FFF8F0] border-2 border-[#C2185B]'

    return 'bg-white hover:bg-gray-50'
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const days = getDaysInMonth(currentDate)
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ]

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#FFF8F0]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C2185B] mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du calendrier...</p>
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
          <h1 className="text-3xl font-bold text-[#C2185B]">📅 Mon Calendrier</h1>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigateMonth('prev')}
              variant="outline"
              className="border-[#C2185B] text-[#C2185B] hover:bg-[#C2185B] hover:text-white"
            >
              ← Précédent
            </Button>
            <h2 className="text-xl font-semibold text-[#C2185B]">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <Button
              onClick={() => navigateMonth('next')}
              variant="outline"
              className="border-[#C2185B] text-[#C2185B] hover:bg-[#C2185B] hover:text-white"
            >
              Suivant →
            </Button>
          </div>
        </div>

        {/* Légende */}
        <Card className="p-4 mb-6 bg-white border-[#C2185B]/20">
          <h3 className="font-semibold text-[#C2185B] mb-3">Légende</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-[#C2185B] rounded"></div>
              <span>Règles actuelles</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-[#FF69B4] rounded"></div>
              <span>Règles prédites</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-[#FFD700] rounded"></div>
              <span>Ovulation</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-[#98FB98] rounded"></div>
              <span>Période fertile</span>
            </div>
          </div>
        </Card>

        {/* Calendrier */}
        <Card className="p-6 bg-white border-[#C2185B]/20">
          <div className="grid grid-cols-7 gap-1">
            {/* Jours de la semaine */}
            {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
              <div key={day} className="p-2 text-center font-semibold text-[#C2185B] border-b">
                {day}
              </div>
            ))}

            {/* Jours du mois */}
            {days.map((date, index) => (
              <div
                key={index}
                className={`p-2 text-center min-h-[60px] border rounded-lg transition-colors ${getDayClass(date)}`}
              >
                {date && (
                  <div className="text-sm font-medium">
                    {date.getDate()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  )
}