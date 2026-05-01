import { GoogleGenerativeAI } from '@google/generative-ai'
  import { NextRequest, NextResponse } from 'next/server'
  
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  
  const PROMPT_SYSTEME = `
  Tu es Anoushka, une assistante santé féminine bienveillante.
  Tu aides les femmes du Burkina Faso à comprendre leur cycle menstruel.
  Tu réponds dans la langue de l''utilisatrice (français, mooré ou dioula).
  Tu ne poses jamais de diagnostic. Tes réponses sont courtes et claires.
  `
  
  export async function POST(request: NextRequest) {
  let message = ""
  
  try {
    const data = await request.json()
    message = data.message
    const historique = data.historique
    
    console.log('Message reçu:', message)
    console.log('API Key disponible:', !!process.env.GEMINI_API_KEY)
    
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Clé API Gemini manquante')
    }
    
    const modele = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    console.log('Modèle Gemini initialisé')

    // Utiliser une approche simple sans historique pour commencer
    const chat = modele.startChat({
      systemInstruction: {
        role: 'user',
        parts: [{ text: PROMPT_SYSTEME }]
      }
    })

    console.log('Envoi du message à Gemini...')
    const resultat = await chat.sendMessage(message)
    const responseText = resultat.response.text()
    
    console.log('Réponse Gemini brute:', responseText)
    console.log('Longueur de la réponse:', responseText?.length || 0)
    
    // Vérifier si la réponse est vide ou ne contient que des espaces
    if (!responseText || responseText.trim() === '') {
      console.log('Réponse vide détectée')
      
      // Essayer avec un prompt plus simple
      const simplePrompt = "Tu es Anoushka, une assistante santé féminine. Réponds simplement et clairement."
      const simpleChat = modele.startChat({
        systemInstruction: {
          role: 'user',
          parts: [{ text: simplePrompt }]
        }
      })
      
      console.log('Tentative avec prompt simple...')
      const simpleResult = await simpleChat.sendMessage(message)
      const simpleResponse = simpleResult.response.text()
      
      console.log('Réponse simple:', simpleResponse)
      
      if (!simpleResponse || simpleResponse.trim() === '') {
        // Dernier essai : sans system instruction
        console.log('Dernier essai sans system instruction...')
        const basicChat = modele.startChat()
        const basicResult = await basicChat.sendMessage("Bonjour. " + message)
        const basicResponse = basicResult.response.text()
        
        console.log('Réponse basique:', basicResponse)
        
        if (!basicResponse || basicResponse.trim() === '') {
          throw new Error('Toutes les tentatives ont échoué - réponse vide')
        }
        
        return NextResponse.json({ reponse: basicResponse })
      }
      
      return NextResponse.json({ reponse: simpleResponse })
    }
    
    return NextResponse.json({ reponse: responseText })
  } catch (error) {
    console.error('Erreur chatbot complète:', error)
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace available')
    
    // Réponses prédéfinies pour les questions courantes
    const reponsesPredefinies = {
      "règles": "Les règles sont un processus naturel du cycle menstruel. Elles durent généralement entre 3 et 7 jours. Si tu as des questions spécifiques sur tes règles, n'hésite pas à consulter un professionnel de santé.",
      "cycle": "Un cycle menstruel dure en moyenne 28 jours, mais peut varier entre 21 et 35 jours. Il se compose de différentes phases : les règles, la phase folliculaire, l'ovulation et la phase lutéale.",
      "ovulation": "L'ovulation a lieu généralement au milieu du cycle, vers le jour 14 dans un cycle de 28 jours. C'est la période la plus fertile du cycle.",
      "fertile": "La période fertile dure environ 6 jours et se termine environ 24h après l'ovulation. C'est le moment optimal pour concevoir si tu souhaites avoir un enfant.",
      "douleur": "Les douleurs menstruelles sont courantes. Tu peux essayer des compresses chaudes, du repos, ou des anti-inflammatoires. Si les douleurs sont intenses, consulte un médecin.",
      "retard": "Un retard de règles peut avoir plusieurs causes : stress, changement de routine, ou début de grossesse. Fais un test de grossesse si tu es sexuellement active.",
      "irrégulier": "Les cycles irréguliers sont fréquents, surtout chez les adolescentes. Tiens un journal de tes cycles pour mieux les comprendre. Consulte un médecin si tu es inquiète."
    }
    
    // Vérifier si le message correspond à une question courante
    const messageLower = message.toLowerCase()
    let reponseTrouvee = null
    
    for (const [cle, reponse] of Object.entries(reponsesPredefinies)) {
      if (messageLower.includes(cle)) {
        reponseTrouvee = reponse
        break
      }
    }
    
    if (reponseTrouvee) {
      return NextResponse.json({ reponse: reponseTrouvee })
    }
    
    // Réponse par défaut
    return NextResponse.json({ 
      reponse: "Désolée, je rencontre des difficultés techniques. Pour des questions sur votre cycle menstruel, je vous recommande de consulter un professionnel de santé. Vous pouvez aussi essayer de reformuler votre question plus simplement." 
    })
  }
}
