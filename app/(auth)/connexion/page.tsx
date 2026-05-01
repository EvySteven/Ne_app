'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Sparkles, Heart } from 'lucide-react'

const schema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
})

type FormData = z.infer<typeof schema>

export default function PageConnexion() {
  const router = useRouter()
  const [chargement, setChargement] = useState(false)
  const [erreur, setErreur] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  const soumettre = async (donnees: FormData) => {
    setChargement(true)
    setErreur('')

    try {
      const resultat = await signIn('credentials', {
        email: donnees.email,
        motDePasse: donnees.password,
        redirect: false,
      })

      if (resultat?.error) {
        setErreur('Email ou mot de passe incorrect')
        return
      }

      // Rediriger vers le tableau de bord ou l'onboarding
      try {
        const cyclesResponse = await fetch('/api/cycles')
        const cyclesData = await cyclesResponse.json()

        if (cyclesResponse.ok && cyclesData.cycles && cyclesData.cycles.length === 0) {
          // Pas de cycles = onboarding pas fait
          router.push('/onboarding')
        } else {
          // Cycles existants = aller au dashboard
          router.push('/dashboard')
        }
      } catch {
        // En cas d'erreur, aller au dashboard par défaut
        router.push('/dashboard')
      }

    } catch {
      setErreur('Problème de connexion. Vérifie ton internet.')
    } finally {
      setChargement(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0]">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        {/* Logo et titre */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#C2185B] flex items-center justify-center gap-2"><Sparkles className="w-8 h-8" /> Né</h1>
          <p className="text-gray-500 mt-2">Connecte-toi</p>
        </div>

        {/* Message d'erreur */}
        {erreur && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
            {erreur}
          </div>
        )}

        <form action="#" method="post" onSubmit={(e) => {
          e.preventDefault()
          void handleSubmit(soumettre)(e)
        }} className="space-y-4">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              placeholder="Ton email"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#C2185B]"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              {...register('password')}
              type="password"
              placeholder="Ton mot de passe"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#C2185B]"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Bouton */}
          <button
            type="submit"
            disabled={chargement}
            className="w-full bg-[#C2185B] text-white py-3 rounded-lg font-semibold hover:bg-[#7B1FA2] transition-colors disabled:opacity-50 mt-2"
          >
            {chargement ? 'Connexion...' : 'Se connecter'}
          </button>

        </form>

        {/* Liens */}
        <div className="text-center mt-6 space-y-2">
          <p>
            <a href="/recuperation" className="text-sm text-[#C2185B] hover:underline">
              Mot de passe oublié ?
            </a>
          </p>
          <p className="text-sm text-gray-500">
            Pas encore de compte ?{' '}
            <a href="/inscription" className="text-[#C2185B] font-medium hover:underline">
              inscris toi
            </a>
          </p>
        </div>

      </div>
    </div>
  )
}