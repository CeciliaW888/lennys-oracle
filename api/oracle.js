import { GoogleGenerativeAI } from '@google/generative-ai'

const SYSTEM_PROMPT = `You are Lenny's Oracle — a mystical, wise guide that channels the wisdom of 303 episodes of Lenny's Podcast. You speak with the authority and warmth of someone who has deeply absorbed all the podcast conversations.

PERSONALITY:
- Wise but approachable. Think "mystical sage meets helpful colleague"
- Reference specific guests and episodes naturally: "As Elena Verna shared in her episode..."
- Use occasional mystical framing: "The stars of product wisdom align here..."
- Keep answers substantive and practical, not fluffy
- Attribute insights to specific guests whenever possible

RESPONSE FORMAT:
- Start with a brief, engaging hook (1-2 sentences)
- Provide the main answer with guest attributions
- Use **bold** for key concepts
- Keep responses under 400 words unless the question demands more
- End with a practical takeaway or actionable insight

ATTRIBUTION:
- Always mention which guest said what
- Format: "According to [Guest Name]..." or "[Guest Name] emphasizes..."
- Include episode references naturally

KNOWLEDGE BASE:
You have access to frameworks and quotes from 50 PM frameworks extracted from the podcast, plus an index of all 303 episodes with guest names and topics.

When you reference a guest, include their name for source attribution.`

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' })
  }

  try {
    const { question, cardContext, episodeContext } = req.body
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' })
    }

    const cleanKey = apiKey.trim()
    const genAI = new GoogleGenerativeAI(cleanKey)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: SYSTEM_PROMPT,
    })

    const prompt = `FRAMEWORK KNOWLEDGE:
${cardContext}

EPISODE INDEX:
${episodeContext}

USER QUESTION: ${question}

Provide a thoughtful answer drawing on the podcast wisdom above. Reference specific guests and frameworks. Include 2-4 relevant source episodes at the end as JSON in this format:
[SOURCES]
[{"guest": "Name", "youtubeUrl": "url"}]
[/SOURCES]`

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    // Parse sources
    let answer = text
    let sources = []
    
    const sourcesMatch = text.match(/\[SOURCES\]\s*([\s\S]*?)\s*\[\/SOURCES\]/)
    if (sourcesMatch) {
      answer = text.replace(/\[SOURCES\][\s\S]*?\[\/SOURCES\]/, '').trim()
      try {
        sources = JSON.parse(sourcesMatch[1])
      } catch {}
    }

    // Detect categories
    const categories = []
    const catKeywords = {
      Growth: ['growth', 'retention', 'acquisition', 'viral', 'loop', 'activation', 'onboarding'],
      Strategy: ['strategy', 'priorit', 'position', 'roadmap', 'vision', 'pivot'],
      Design: ['design', 'user research', 'discovery', 'prototype', 'empathy', 'ux'],
      Leadership: ['leader', 'manage', 'team', 'hire', 'feedback', 'communication'],
      Data: ['metric', 'data', 'analytics', 'experiment', 'a/b test', 'cohort'],
      Culture: ['culture', 'value', 'process', 'remote', 'writing', 'psychological safety'],
    }
    
    const lowerAnswer = answer.toLowerCase()
    for (const [cat, keywords] of Object.entries(catKeywords)) {
      if (keywords.some(kw => lowerAnswer.includes(kw))) {
        categories.push(cat)
      }
    }

    return res.status(200).json({ answer, sources, categories })
  } catch (err) {
    console.error('Oracle API error:', err.message || err)
    return res.status(500).json({ error: 'Failed to generate response', detail: err.message })
  }
}
