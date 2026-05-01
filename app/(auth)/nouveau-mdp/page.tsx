'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Sparkles, Heart } from 'lucide-react'

const schema = z.object({
  code: z.string().min(6, 'Le code fait 6 chiffres').max(6, 'Le code fait 6 chiffres'),
  password: z.string().min(6, 'Au moins 6 caractères'),
  confirmation: z.string()
}).refine(data => data.password === data.confirmation, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmation']
})

type FormData = z.infer<typeof schema>

export default function PageNouveauMdp() {
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
      // À implémenter plus tard avec l'API
      console.log('Nouveau mot de passe avec code :', donnees.code)
      router.push('/connexion')
    } catch {
      setErreur('Code invalide ou expiré. Réessaie.')
    } finally {
      setChargement(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0]">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#C2185B] flex items-center justify-center gap-2"><Sparkles className="w-8 h-8" /> Né</h1>
          <p className="text-gray-500 mt-2">Nouveau mot de passe</p>
        </div>

        {erreur && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
            {erreur}
          </div>
        )}

        <form onSubmit={handleSubmit(soumettre)} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Code reçu par email
            </label>
            <input
              {...register('code')}
              placeholder="123456"
              maxLength={6}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#C2185B] text-center text-xl tracking-widest"
            />
            {errors.code && (
              <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nouveau mot de passe
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

          <button
            type="submit"
            disabled={chargement}
            className="w-full bg-[#C2185B] text-white py-3 rounded-lg font-semibold hover:bg-[#7B1FA2] transition-colors disabled:opacity-50"
          >
            {chargement ? 'Mise à jour...' : 'Changer mon mot de passe'}
          </button>

        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          <a href="/connexion" className="text-[#C2185B] hover:underline">
            ← Retour à la connexion
          </a>
        </p>

      </div>
    </div>
  )
}