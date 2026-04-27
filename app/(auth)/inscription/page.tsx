'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'

// Règles de validation
const schema = z.object({
  pseudo: z.string().min(3, 'Au moins 3 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Au moins 6 caractères'),
  confirmation: z.string()
}).refine(data => data.password === data.confirmation, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmation']
})

type FormData = z.infer<typeof schema>

export default function PageInscription() {
  const router = useRouter()
  const [chargement, setChargement] = useState(false)
  const [erreurServeur, setErreurServeur] = useState('')
  const [succes, setSucces] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  const soumettre = async (donnees: FormData) => {
    setChargement(true)
    setErreurServeur('')

    try {
      const reponse = await fetch('/api/auth/inscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pseudo: donnees.pseudo,
          email: donnees.email,
          password: donnees.password
        })
      })

      const resultat = await reponse.json()

      if (!reponse.ok) {
        setErreurServeur(resultat.erreur)
        return
      }

      setSucces(resultat.message)
      // Rediriger vers l'onboarding après inscription
      setTimeout(() => {
        router.push('/onboarding')
      }, 2000) // Délai pour montrer le message de succès

    } catch {
      setErreurServeur('Problème de connexion. Vérifie ton internet.')
    } finally {
      setChargement(false)
    }

    } catch {
      setErreurServeur('Problème de connexion. Vérifie ton internet.')
    } finally {
      setChargement(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0]">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        {/* Logo et titre */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#C2185B]">Né 🌸</h1>
          <p className="text-gray-500 mt-2">Crée ton compte</p>
        </div>

        {/* Message de succès */}
        {succes && (
          <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 text-sm text-center">
            {succes}
          </div>
        )}

        {/* Message d'erreur serveur */}
        {erreurServeur && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
            {erreurServeur}
          </div>
        )}

        <form onSubmit={handleSubmit(soumettre)} className="space-y-4">

          {/* Pseudo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pseudo
            </label>
            <input
              {...register('pseudo')}
              placeholder="Ton pseudo"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#C2185B]"
            />
            {errors.pseudo && (
              <p className="text-red-500 text-xs mt-1">{errors.pseudo.message}</p>
            )}
          </div>

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
              placeholder="Au moins 6 caractères"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#C2185B]"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirmation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirme le mot de passe
            </label>
            <input
              {...register('confirmation')}
              type="password"
              placeholder="Répète ton mot de passe"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#C2185B]"
            />
            {errors.confirmation && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmation.message}</p>
            )}
          </div>

          {/* Bouton */}
          <button
            type="submit"
            disabled={chargement}
            className="w-full bg-[#C2185B] text-white py-3 rounded-lg font-semibold hover:bg-[#7B1FA2] transition-colors disabled:opacity-50 mt-2"
          >
            {chargement ? 'Création en cours...' : "Créer mon compte 🌸"}
          </button>

        </form>

        {/* Lien connexion */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Tu as déjà un compte ?{' '}
          <a href="/connexion" className="text-[#C2185B] font-medium hover:underline">
            Connecte-toi
          </a>
        </p>

      </div>
    </div>
  )
}