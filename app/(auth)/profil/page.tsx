'use client'

import { useEffect, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Navigation } from '@/components/navigation'
import { Sparkles } from 'lucide-react'

interface UserProfile {
  id: string
  email: string
  pseudo: string
  createdAt: string
}

export default function ProfilPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    pseudo: '',
    email: ''
  })

  useEffect(() => {
    console.log('Profile page - Status:', status)
    console.log('Profile page - Session:', session?.user)
    
    if (status === 'unauthenticated') {
      console.log('Redirection vers connexion - utilisateur non authentifié')
      router.push('/connexion')
      return
    }

    if (status === 'loading') {
      console.log('Session en cours de chargement...')
      return // Attendre que la session soit chargée
    }

    if (session?.user) {
      console.log('Session trouvée, chargement du profil...')
      fetchProfile()
    } else if (status === 'authenticated' && !session?.user) {
      // Session authentifiée mais données user manquantes
      console.log('Session authentifiée mais données utilisateur incomplètes')
      setLoading(false)
    } else if (status === 'authenticated' && !loading && !profile) {
      // Session OK mais profil pas chargé - afficher quand même
      console.log('Session OK mais profil non initialisé, affichage par défaut')
      setProfile({
        id: session?.user?.id || 'inconnu',
        email: session?.user?.email || 'email@exemple.com',
        pseudo: session?.user?.name || 'Utilisateur',
        createdAt: new Date().toISOString()
      })
      setFormData({
        pseudo: session?.user?.name || 'Utilisateur',
        email: session?.user?.email || 'email@exemple.com'
      })
    }
  }, [session, status, router])

  const fetchProfile = async () => {
    try {
      // Pour l'instant, on utilise les données de la session
      // Plus tard, on pourra ajouter une API pour récupérer le profil complet
      setProfile({
        id: session?.user?.id || '',
        email: session?.user?.email || '',
        pseudo: session?.user?.name || '',
        createdAt: new Date().toISOString() // À remplacer par la vraie date
      })
      setFormData({
        pseudo: session?.user?.name || '',
        email: session?.user?.email || ''
      })
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // TODO: Implémenter la mise à jour du profil via API
      console.log('Mise à jour du profil:', formData)
      setEditing(false)
      // Recharger le profil après mise à jour
      await fetchProfile()
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
    }
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/connexion' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">Chargement du profil...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-2"><Sparkles className="w-8 h-8 text-[#C2185B]" /> Mon Profil</h1>

          <div className="space-y-6">
            {/* Informations du profil */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Informations personnelles
              </h2>

              {editing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pseudo
                    </label>
                    <Input
                      type="text"
                      value={formData.pseudo}
                      onChange={(e) => setFormData({ ...formData, pseudo: e.target.value })}
                      placeholder="Votre pseudo"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="votre.email@exemple.com"
                      required
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" className="bg-pink-500 hover:bg-pink-600">
                      Sauvegarder
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditing(false)}
                    >
                      Annuler
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pseudo
                    </label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded">
                      {profile?.pseudo}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded">
                      {profile?.email}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Membre depuis
                    </label>
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded">
                      {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
                    </p>
                  </div>

                  <Button
                    onClick={() => setEditing(true)}
                    className="bg-pink-500 hover:bg-pink-600"
                  >
                    Modifier le profil
                  </Button>
                </div>
              )}
            </Card>

            {/* Paramètres de l'application */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Paramètres de l'application
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Notifications</h3>
                    <p className="text-sm text-gray-600">
                      Recevoir des rappels pour votre cycle
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configurer
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Confidentialité</h3>
                    <p className="text-sm text-gray-600">
                      Gérer la visibilité de vos données
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Gérer
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Langue</h3>
                    <p className="text-sm text-gray-600">
                      Français, Mooré, Dioula
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Changer
                  </Button>
                </div>
              </div>
            </Card>

            {/* Actions du compte */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Actions du compte
              </h2>

              <div className="space-y-3">
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="w-full border-red-300 text-red-600 hover:bg-red-50"
                >
                  Se déconnecter
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Supprimer mon compte
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}