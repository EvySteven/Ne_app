'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Navigation } from '@/components/navigation'
import { Lightbulb, AlertTriangle } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Salut ! Je suis Anoushka, ton assistante santé féminine. Je peux t\'aider à comprendre ton cycle menstruel, répondre à tes questions sur la santé féminine, ou te donner des conseils personnalisés. Comment puis-je t\'aider aujourd\'hui ?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          historique: messages.map(m => ({
            role: m.role,
            parts: [{ text: m.content }]
          }))
        })
      })

      const data = await response.json()

      // Toujours afficher la réponse, même si c'est une réponse par défaut
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.reponse || 'Désolée, je n\'ai pas pu traiter ta demande. Essaie de reformuler ta question.',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Erreur chatbot:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Désolée, je rencontre un problème technique. Peux-tu réessayer dans quelques instants ?',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#FFF8F0]">
      <Navigation />
      <div className="max-w-4xl mx-auto p-4">
        {/* Chat container */}
        <Card className="h-[600px] flex flex-col bg-white border-[#C2185B]/20">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-[#C2185B] text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-pink-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#C2185B]"></div>
                    <span>Anoushka réfléchit...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input form */}
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Pose-moi une question sur ton cycle, ta santé..."
                className="flex-1"
                disabled={loading}
              />
              <Button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-[#C2185B] hover:bg-[#A0154A] px-6"
              >
                {loading ? '...' : 'Envoyer'}
              </Button>
            </form>
          </div>
        </Card>

        {/* Suggestions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4 bg-white border-[#C2185B]/20">
            <h3 className="font-semibold text-[#C2185B] mb-2 flex items-center gap-2"><Lightbulb className="w-4 h-4" /> Questions fréquentes</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• "Quand aurai-je mes prochaines règles ?"</li>
              <li>• "Comment calculer ma période fertile ?"</li>
              <li>• "Que faire contre les douleurs menstruelles ?"</li>
              <li>• "Mon cycle est-il normal ?"</li>
            </ul>
          </Card>
          <Card className="p-4 bg-white border-[#C2185B]/20">
            <h3 className="font-semibold text-[#C2185B] mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Important</h3>
            <p className="text-sm text-gray-600">
              Je ne suis pas un médecin. Pour des problèmes de santé sérieux,
              consulte toujours un professionnel de santé qualifié.
            </p>
          </Card>
        </div>
      </div>
    </main>
  )
}