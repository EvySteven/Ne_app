'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Email invalide'),
})

type FormData = z.infer<typeof schema>

export default function PageRecuperation() {
  const [chargement, setChargement] = useState(false)
  const [succes, setSucces] = useState(false)
  const [erreur, setErreur] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  const soumettre = async (donnees: FormData) => {
    setChargement(true)
    setErreur('')

    try {
      // À implémenter plus tard avec Nodemailer
      console.log('Email de récupération pour :', donnees.email)
      setSucces(true)
    } catch {
      setErreur('Problème de connexion. Réessaie.')
    } finally {
      setChargement(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0]">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#C2185B]">Né 🌸</h1>
          <p className="text-gray-500 mt-2">Récupère ton compte</p>
        </div>

        {succes ? (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg text-center">
            <p className="font-medium">Un code t'a été envoyé ! 💜</p>
            <p className="text-sm mt-1">Vérifie ta boîte email.</p>
            <a href="/nouveau-mdp" className="text-[#C2185B] text-sm font-medium hover:underline mt-3 block">
              Entrer le code →
            </a>
          </div>
        ) : (
          <>
            {erreur && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
                {erreur}
              </div>
            )}

            <form onSubmit={handleSubmit(soumettre)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ton email
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

              <button
                type="submit"
                disabled={chargement}
                className="w-full bg-[#C2185B] text-white py-3 rounded-lg font-semibold hover:bg-[#7B1FA2] transition-colors disabled:opacity-50"
              >
                {chargement ? 'Envoi...' : 'Envoyer le code 💜'}
              </button>
            </form>
          </>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          <a href="/connexion" className="text-[#C2185B] hover:underline">
            ← Retour à la connexion
          </a>
        </p>

      </div>
    </div>
  )
}