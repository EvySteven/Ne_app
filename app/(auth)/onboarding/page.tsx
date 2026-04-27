'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

type OnboardingStep = 'welcome' | 'first-cycle' | 'features' | 'complete'

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome')
  const [firstCycle, setFirstCycle] = useState({
    dateDebut: '',
    dateFin: '',
    dureeJours: ''
  })
  const [loading, setLoading] = useState(false)

  const handleAddFirstCycle = async () => {
    if (!firstCycle.dateDebut) return

    setLoading(true)
    try {
      const response = await fetch('/api/cycles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(firstCycle)
      })

      if (response.ok) {
        setCurrentStep('features')
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du cycle:', error)
    } finally {
      setLoading(false)
    }
  }

  const completeOnboarding = () => {
    // Ici on pourrait sauvegarder que l'onboarding est terminé
    router.push('/dashboard')
  }

  const nextStep = () => {
    switch (currentStep) {
      case 'welcome':
        setCurrentStep('first-cycle')
        break
      case 'first-cycle':
        handleAddFirstCycle()
        break
      case 'features':
        setCurrentStep('complete')
        break
      case 'complete':
        completeOnboarding()
        break
    }
  }

  const prevStep = () => {
    switch (currentStep) {
      case 'first-cycle':
        setCurrentStep('welcome')
        break
      case 'features':
        setCurrentStep('first-cycle')
        break
      case 'complete':
        setCurrentStep('features')
        break
    }
  }

  const renderStepIndicator = () => {
    const steps = [
      { key: 'welcome', label: 'Bienvenue' },
      { key: 'first-cycle', label: 'Premier cycle' },
      { key: 'features', label: 'Fonctionnalités' },
      { key: 'complete', label: 'Terminé' }
    ]

    return (
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  steps.findIndex(s => s.key === currentStep) >= index
                    ? 'bg-[#C2185B] text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index + 1}
              </div>
              <span className={`ml-2 text-sm ${
                steps.findIndex(s => s.key === currentStep) >= index
                  ? 'text-[#C2185B] font-medium'
                  : 'text-gray-500'
              }`}>
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-4 ${
                  steps.findIndex(s => s.key === currentStep) > index
                    ? 'bg-[#C2185B]'
                    : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderWelcomeStep = () => (
    <div className="text-center">
      <div className="mb-8">
        <div className="text-6xl mb-4">🌸</div>
        <h1 className="text-3xl font-bold text-[#C2185B] mb-4">
          Bienvenue sur Né App !
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
          Votre compagnon intelligent pour comprendre et suivre votre cycle menstruel.
          Ensemble, nous allons découvrir comment votre corps fonctionne et vous aider
          à mieux anticiper vos périodes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-white border-[#C2185B]/20">
          <div className="text-3xl mb-3">📊</div>
          <h3 className="font-semibold text-[#C2185B] mb-2">Prédictions</h3>
          <p className="text-sm text-gray-600">
            Des prédictions précises basées sur vos données personnelles
          </p>
        </Card>
        <Card className="p-6 bg-white border-[#C2185B]/20">
          <div className="text-3xl mb-3">📅</div>
          <h3 className="font-semibold text-[#C2185B] mb-2">Suivi</h3>
          <p className="text-sm text-gray-600">
            Un calendrier intuitif pour visualiser vos cycles
          </p>
        </Card>
        <Card className="p-6 bg-white border-[#C2185B]/20">
          <div className="text-3xl mb-3">🤖</div>
          <h3 className="font-semibold text-[#C2185B] mb-2">Conseils</h3>
          <p className="text-sm text-gray-600">
            Anoushka, votre assistante IA pour des conseils personnalisés
          </p>
        </Card>
      </div>
    </div>
  )

  const renderFirstCycleStep = () => (
    <div className="text-center max-w-md mx-auto">
      <div className="mb-8">
        <div className="text-5xl mb-4">🩸</div>
        <h2 className="text-2xl font-bold text-[#C2185B] mb-4">
          Ajoutez votre dernier cycle
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Pour commencer, dites-nous quand vos dernières règles ont commencé.
          Plus vous ajoutez de données, plus les prédictions seront précises !
        </p>
      </div>

      <Card className="p-6 bg-white border-[#C2185B]/20">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de début des règles *
            </label>
            <Input
              type="date"
              value={firstCycle.dateDebut}
              onChange={(e) => setFirstCycle({...firstCycle, dateDebut: e.target.value})}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de fin (optionnel)
            </label>
            <Input
              type="date"
              value={firstCycle.dateFin}
              onChange={(e) => setFirstCycle({...firstCycle, dateFin: e.target.value})}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Durée des règles en jours (optionnel)
            </label>
            <Input
              type="number"
              value={firstCycle.dureeJours}
              onChange={(e) => setFirstCycle({...firstCycle, dureeJours: e.target.value})}
              placeholder="5"
              className="w-full"
            />
          </div>
        </div>
      </Card>
    </div>
  )

  const renderFeaturesStep = () => (
    <div className="text-center">
      <div className="mb-8">
        <div className="text-5xl mb-4">✨</div>
        <h2 className="text-2xl font-bold text-[#C2185B] mb-4">
          Découvrez vos outils
        </h2>
        <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Né App vous offre tous les outils nécessaires pour comprendre votre cycle
          et prendre soin de votre santé féminine.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-white border-[#C2185B]/20 text-left">
          <div className="flex items-start space-x-4">
            <div className="text-3xl">📊</div>
            <div>
              <h3 className="font-semibold text-[#C2185B] mb-2">Tableau de bord</h3>
              <p className="text-sm text-gray-600 mb-3">
                Visualisez vos prédictions, ajoutez des cycles et suivez vos statistiques.
              </p>
              <Button
                size="sm"
                variant="outline"
                className="border-[#C2185B] text-[#C2185B] hover:bg-[#C2185B] hover:text-white"
                onClick={() => router.push('/dashboard')}
              >
                Explorer →
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border-[#C2185B]/20 text-left">
          <div className="flex items-start space-x-4">
            <div className="text-3xl">📅</div>
            <div>
              <h3 className="font-semibold text-[#C2185B] mb-2">Calendrier</h3>
              <p className="text-sm text-gray-600 mb-3">
                Une vue d'ensemble de vos cycles avec périodes fertiles et ovulation.
              </p>
              <Button
                size="sm"
                variant="outline"
                className="border-[#C2185B] text-[#C2185B] hover:bg-[#C2185B] hover:text-white"
                onClick={() => router.push('/calendrier')}
              >
                Explorer →
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border-[#C2185B]/20 text-left">
          <div className="flex items-start space-x-4">
            <div className="text-3xl">📔</div>
            <div>
              <h3 className="font-semibold text-[#C2185B] mb-2">Journal intime</h3>
              <p className="text-sm text-gray-600 mb-3">
                Notez vos symptômes, humeur et énergie pour mieux vous connaître.
              </p>
              <Button
                size="sm"
                variant="outline"
                className="border-[#C2185B] text-[#C2185B] hover:bg-[#C2185B] hover:text-white"
                onClick={() => router.push('/details')}
              >
                Explorer →
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white border-[#C2185B]/20 text-left">
          <div className="flex items-start space-x-4">
            <div className="text-3xl">🤖</div>
            <div>
              <h3 className="font-semibold text-[#C2185B] mb-2">Anoushka</h3>
              <p className="text-sm text-gray-600 mb-3">
                Votre assistante IA pour des conseils personnalisés sur votre santé.
              </p>
              <Button
                size="sm"
                variant="outline"
                className="border-[#C2185B] text-[#C2185B] hover:bg-[#C2185B] hover:text-white"
                onClick={() => router.push('/chatbot')}
              >
                Explorer →
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )

  const renderCompleteStep = () => (
    <div className="text-center">
      <div className="mb-8">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-[#C2185B] mb-4">
          Félicitations !
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed max-w-xl mx-auto">
          Vous êtes maintenant prête à utiliser Né App. Votre compagnon de santé
          vous accompagnera dans la découverte de votre cycle et vous aidera à
          prendre soin de vous.
        </p>
      </div>

      <Card className="p-6 bg-white border-[#C2185B]/20 max-w-md mx-auto">
        <div className="text-left space-y-3">
          <div className="flex items-center space-x-3">
            <div className="text-green-500">✓</div>
            <span className="text-sm">Profil créé avec succès</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-green-500">✓</div>
            <span className="text-sm">Premier cycle enregistré</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-green-500">✓</div>
            <span className="text-sm">Outils découverts</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-green-500">✓</div>
            <span className="text-sm">Prêt à commencer !</span>
          </div>
        </div>
      </Card>
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'welcome':
        return renderWelcomeStep()
      case 'first-cycle':
        return renderFirstCycleStep()
      case 'features':
        return renderFeaturesStep()
      case 'complete':
        return renderCompleteStep()
      default:
        return renderWelcomeStep()
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 'welcome':
        return true
      case 'first-cycle':
        return firstCycle.dateDebut !== ''
      case 'features':
        return true
      case 'complete':
        return true
      default:
        return false
    }
  }

  return (
    <main className="min-h-screen bg-[#FFF8F0] py-8">
      <div className="max-w-4xl mx-auto px-4">
        {renderStepIndicator()}

        <div className="mb-8">
          {renderCurrentStep()}
        </div>

        <div className="flex justify-center space-x-4">
          {currentStep !== 'welcome' && (
            <Button
              onClick={prevStep}
              variant="outline"
              className="border-[#C2185B] text-[#C2185B] hover:bg-[#C2185B] hover:text-white"
            >
              ← Précédent
            </Button>
          )}

          <Button
            onClick={nextStep}
            disabled={!canProceed() || loading}
            className="bg-[#C2185B] hover:bg-[#A0154A] px-8"
          >
            {loading ? 'Chargement...' :
             currentStep === 'complete' ? 'Commencer l\'aventure !' :
             'Suivant →'}
          </Button>
        </div>

        {currentStep !== 'complete' && (
          <div className="text-center mt-8">
            <Button
              onClick={completeOnboarding}
              variant="ghost"
              className="text-gray-500 hover:text-gray-700"
            >
              Passer l'onboarding
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}