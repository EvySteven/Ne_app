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
  try {
    const { message, historique } = await request.json()
    const modele = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    // Filtrer et mapper l'historique pour Google Gemini
    let historiqueFiltre = historique || []
    if (historiqueFiltre.length > 0 && historiqueFiltre[0].role === 'assistant') {
      // Si le premier message est de l'assistant, on l'exclut (c'est probablement le message de bienvenue)
      historiqueFiltre = historiqueFiltre.slice(1)
    }

    // Mapper les rôles pour Google Gemini
    const historiqueMappe = historiqueFiltre.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: msg.parts || [{ text: msg.content || '' }]
    }))

    const chat = modele.startChat({
      systemInstruction: PROMPT_SYSTEME,
      history: historiqueMappe
    })

    const resultat = await chat.sendMessage(message)
    return NextResponse.json({ reponse: resultat.response.text() })
  } catch (error) {
    console.error('Erreur chatbot:', error)
    return NextResponse.json(
      { erreur: 'Erreur lors de la génération de la réponse' },
      { status: 500 }
    )
  }
}
