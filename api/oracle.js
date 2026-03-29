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

/** @type {number} Request counter for this cold-start instance */
let requestCount = 0

/**
 * Structured log helper for serverless observability.
 * @param {'info'|'warn'|'error'|'debug'} level
 * @param {string} event - Short event name (e.g. 'request.start')
 * @param {Record<string, any>} data - Structured payload
 */
function log(level, event, data = {}) {
  const entry = {
    ts: new Date().toISOString(),
    level,
    event,
    ...data,
  }
  if (level === 'error') {
    console.error(JSON.stringify(entry))
  } else if (level === 'warn') {
    console.warn(JSON.stringify(entry))
  } else {
    console.log(JSON.stringify(entry))
  }
}

export default async function handler(req, res) {
  const startTime = Date.now()
  requestCount++
  const reqId = `req_${Date.now()}_${requestCount}`

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Health check endpoint (GET)
  if (req.method === 'GET') {
    const hasKey = !!process.env.GEMINI_API_KEY
    log('info', 'health.check', { hasKey, requestCount })
    return res.status(200).json({
      status: 'ok',
      hasApiKey: hasKey,
      uptime: process.uptime(),
      requestCount,
    })
  }

  if (req.method !== 'POST') {
    log('warn', 'method.not_allowed', { method: req.method, reqId })
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // --- API key check ---
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    log('error', 'api_key.missing', { reqId })
    return res.status(500).json({
      error: 'API key not configured',
      code: 'API_KEY_MISSING',
      suggestion: 'Set GEMINI_API_KEY in your environment variables. Get a free key at ai.google.dev.',
    })
  }

  try {
    const { question, cardContext, episodeContext } = req.body

    // --- Input validation ---
    if (!question || typeof question !== 'string') {
      log('warn', 'input.invalid', { reqId, reason: 'missing_question' })
      return res.status(400).json({ error: 'Question is required', code: 'INVALID_INPUT' })
    }

    const trimmedQuestion = question.trim()
    if (trimmedQuestion.length < 3) {
      log('warn', 'input.too_short', { reqId, length: trimmedQuestion.length })
      return res.status(400).json({
        error: 'Question is too short. Please ask a more detailed question.',
        code: 'INPUT_TOO_SHORT',
      })
    }

    if (trimmedQuestion.length > 2000) {
      log('warn', 'input.too_long', { reqId, length: trimmedQuestion.length })
      return res.status(400).json({
        error: 'Question is too long (max 2000 characters).',
        code: 'INPUT_TOO_LONG',
      })
    }

    log('info', 'request.start', { reqId, questionLength: trimmedQuestion.length })

    const cleanKey = apiKey.trim()
    const genAI = new GoogleGenerativeAI(cleanKey)
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: SYSTEM_PROMPT,
    })

    const prompt = `FRAMEWORK KNOWLEDGE:
${cardContext || ''}

EPISODE INDEX:
${episodeContext || ''}

USER QUESTION: ${trimmedQuestion}

Provide a thoughtful answer drawing on the podcast wisdom above. Reference specific guests and frameworks. Include 2-4 relevant source episodes at the end as JSON in this format:
[SOURCES]
[{"guest": "Name", "youtubeUrl": "url"}]
[/SOURCES]`

    const genStart = Date.now()
    const result = await model.generateContent(prompt)
    const genDuration = Date.now() - genStart
    const text = result.response.text()

    log('info', 'gemini.success', { reqId, genDuration, responseLength: text.length })

    // --- Parse sources (with graceful fallback) ---
    let answer = text
    let sources = []

    const sourcesMatch = text.match(/\[SOURCES\]\s*([\s\S]*?)\s*\[\/SOURCES\]/)
    if (sourcesMatch) {
      answer = text.replace(/\[SOURCES\][\s\S]*?\[\/SOURCES\]/, '').trim()
      try {
        const parsed = JSON.parse(sourcesMatch[1])
        // Validate shape: must be array of objects with guest + youtubeUrl
        if (Array.isArray(parsed)) {
          sources = parsed.filter(
            (s) => s && typeof s.guest === 'string' && typeof s.youtubeUrl === 'string'
          )
        }
      } catch (parseErr) {
        log('warn', 'sources.parse_failed', { reqId, raw: sourcesMatch[1].slice(0, 200) })
        // Continue without sources — not a fatal error
      }
    }

    // --- Detect categories ---
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
      if (keywords.some((kw) => lowerAnswer.includes(kw))) {
        categories.push(cat)
      }
    }

    const totalDuration = Date.now() - startTime
    log('info', 'request.complete', { reqId, totalDuration, categories })

    return res.status(200).json({ answer, sources, categories })
  } catch (err) {
    const totalDuration = Date.now() - startTime
    const errMsg = err.message || String(err)

    // --- Specific Gemini error detection ---
    if (errMsg.includes('429') || errMsg.toLowerCase().includes('rate limit') || errMsg.toLowerCase().includes('quota')) {
      log('warn', 'gemini.rate_limited', { reqId, totalDuration, error: errMsg })
      return res.status(429).json({
        error: 'The Oracle is receiving too many questions right now. Please wait a moment and try again.',
        code: 'RATE_LIMITED',
        retryAfter: 30,
      })
    }

    if (errMsg.includes('API_KEY_INVALID') || errMsg.includes('401') || errMsg.includes('403')) {
      log('error', 'gemini.auth_failed', { reqId, totalDuration, error: errMsg })
      return res.status(401).json({
        error: 'The Gemini API key is invalid or expired. Please update it.',
        code: 'AUTH_FAILED',
      })
    }

    if (errMsg.includes('SAFETY') || errMsg.includes('blocked')) {
      log('warn', 'gemini.safety_block', { reqId, totalDuration, error: errMsg })
      return res.status(400).json({
        error: 'The question was blocked by content safety filters. Please rephrase.',
        code: 'SAFETY_BLOCKED',
      })
    }

    log('error', 'request.failed', { reqId, totalDuration, error: errMsg, stack: err.stack?.slice(0, 500) })
    return res.status(500).json({
      error: 'Failed to generate response. Please try again.',
      code: 'INTERNAL_ERROR',
      detail: process.env.NODE_ENV === 'development' ? errMsg : undefined,
    })
  }
}
