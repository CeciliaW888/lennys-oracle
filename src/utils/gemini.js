import episodes from '../data/episodes.json'
import cards from '../data/cards.json'

/**
 * Structured debug logger for client-side observability.
 * Only outputs in development or when localStorage flag is set.
 * @param {string} event - Event name
 * @param {Record<string, any>} data - Payload
 */
function debugLog(event, data = {}) {
  if (import.meta.env.DEV || safeLocalStorageGet('oracle_debug') === 'true') {
    console.debug(`[oracle] ${event}`, { ts: Date.now(), ...data })
  }
}

// ─── Safe localStorage helpers ───────────────────────────────────────

/**
 * Read from localStorage with try-catch fallback.
 * Returns null if unavailable (private browsing, quota exceeded, etc.)
 * @param {string} key
 * @returns {string|null}
 */
function safeLocalStorageGet(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

/**
 * Write to localStorage with try-catch fallback (silently fails).
 * @param {string} key
 * @param {string} value
 */
function safeLocalStorageSet(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch {
    debugLog('localStorage.write_failed', { key })
  }
}

// ─── API Telemetry ───────────────────────────────────────────────────

/** @type {{ success: number, failure: number, lastUpdated: string }} */
const DEFAULT_TELEMETRY = { success: 0, failure: 0, lastUpdated: '' }

/**
 * Read API telemetry stats from localStorage.
 * @returns {{ success: number, failure: number, lastUpdated: string }}
 */
function getTelemetry() {
  const raw = safeLocalStorageGet('oracle_telemetry')
  if (!raw) return { ...DEFAULT_TELEMETRY }
  try {
    return JSON.parse(raw)
  } catch {
    return { ...DEFAULT_TELEMETRY }
  }
}

/**
 * Record an API call outcome (success or failure) + latency.
 * @param {'success'|'failure'} outcome
 * @param {number} latencyMs
 */
function recordTelemetry(outcome, latencyMs) {
  const t = getTelemetry()
  t[outcome] = (t[outcome] || 0) + 1
  t.lastUpdated = new Date().toISOString()
  t.lastLatencyMs = latencyMs
  safeLocalStorageSet('oracle_telemetry', JSON.stringify(t))
  debugLog('telemetry.recorded', { outcome, latencyMs, stats: t })
}

// ─── Context builder ─────────────────────────────────────────────────

function buildContext() {
  debugLog('context.building', { cards: cards.length, episodes: episodes.length })

  const cardContext = cards
    .map(
      (c) =>
        `Framework: ${c.framework} (${c.category})\nDescription: ${c.description}\nQuote: "${c.quote}"\nGuest: ${c.guest}\nEpisode: ${c.episodeSlug}\nYouTube: ${c.youtubeUrl}`
    )
    .join('\n\n')

  const episodeContext = episodes
    .slice(0, 100)
    .map((ep) => `Guest: ${ep.guest} | Title: ${ep.title} | YouTube: ${ep.youtubeUrl}`)
    .join('\n')

  return { cardContext, episodeContext }
}

// ─── Error classification ────────────────────────────────────────────

/**
 * Map API error codes to user-friendly messages with recovery suggestions.
 * @param {string} code - Error code from API response
 * @param {number} status - HTTP status code
 * @returns {{ message: string, suggestion: string }}
 */
function classifyError(code, status) {
  switch (code) {
    case 'API_KEY_MISSING':
      return {
        message: 'The Oracle needs a Gemini API key to function.',
        suggestion: 'Get a free key at ai.google.dev and add it to your environment.',
      }
    case 'AUTH_FAILED':
      return {
        message: 'The API key is invalid or expired.',
        suggestion: 'Check your GEMINI_API_KEY is correct and active.',
      }
    case 'RATE_LIMITED':
      return {
        message: 'Too many questions — the Oracle needs a moment to rest.',
        suggestion: 'Wait 30 seconds and try again.',
      }
    case 'SAFETY_BLOCKED':
      return {
        message: 'That question was blocked by safety filters.',
        suggestion: 'Try rephrasing your question differently.',
      }
    case 'INPUT_TOO_SHORT':
      return {
        message: 'Your question is too short.',
        suggestion: 'Ask a more detailed question (at least 3 characters).',
      }
    case 'INPUT_TOO_LONG':
      return {
        message: 'Your question is too long.',
        suggestion: 'Keep it under 2000 characters.',
      }
    default:
      break
  }

  // Fallback by HTTP status
  if (status === 429) {
    return {
      message: 'Rate limit reached.',
      suggestion: 'Wait a moment and try again.',
    }
  }
  if (status >= 500) {
    return {
      message: 'The Oracle encountered a server error.',
      suggestion: 'Try again in a few seconds. If it persists, the API might be down.',
    }
  }
  if (status === 0 || !status) {
    return {
      message: 'Unable to reach the Oracle — check your internet connection.',
      suggestion: 'Make sure you\'re online, then try again.',
    }
  }

  return {
    message: 'Something went wrong.',
    suggestion: 'Try again. If the issue persists, check the browser console.',
  }
}

// ─── Retry logic ─────────────────────────────────────────────────────

/**
 * Fetch with exponential backoff retry for transient failures (429, 5xx, network).
 * @param {string} url
 * @param {RequestInit} options
 * @param {{ maxRetries?: number, signal?: AbortSignal }} retryOpts
 * @returns {Promise<Response>}
 */
async function fetchWithRetry(url, options, { maxRetries = 2, signal } = {}) {
  let lastError

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    // Check abort before each attempt
    if (signal?.aborted) {
      throw new DOMException('Request cancelled', 'AbortError')
    }

    try {
      const response = await fetch(url, { ...options, signal })

      // Don't retry client errors (except 429)
      if (response.ok || (response.status >= 400 && response.status < 500 && response.status !== 429)) {
        return response
      }

      // Retry on 429 or 5xx
      if (attempt < maxRetries && (response.status === 429 || response.status >= 500)) {
        const backoffMs = Math.min(1000 * 2 ** attempt + Math.random() * 500, 10000)
        debugLog('fetch.retry', { attempt: attempt + 1, status: response.status, backoffMs: Math.round(backoffMs) })
        await new Promise((resolve) => setTimeout(resolve, backoffMs))
        continue
      }

      return response
    } catch (err) {
      lastError = err

      // Don't retry aborts
      if (err.name === 'AbortError') throw err

      // Retry network errors
      if (attempt < maxRetries) {
        const backoffMs = Math.min(1000 * 2 ** attempt + Math.random() * 500, 10000)
        debugLog('fetch.retry_network', { attempt: attempt + 1, error: err.message, backoffMs: Math.round(backoffMs) })
        await new Promise((resolve) => setTimeout(resolve, backoffMs))
        continue
      }
    }
  }

  throw lastError || new Error('Request failed after retries')
}

// ─── Main Oracle API call ────────────────────────────────────────────

/** @type {AbortController|null} Currently in-flight request controller */
let activeController = null

/**
 * Ask the Oracle a question.
 * Includes retry logic, abort support, telemetry, and structured error handling.
 *
 * @param {string} question - The user's question
 * @param {{ signal?: AbortSignal }} [options] - Optional abort signal
 * @returns {Promise<{ answer: string, sources: Array<{guest: string, youtubeUrl: string}>, categories?: string[], error?: { message: string, suggestion: string } }>}
 */
export async function askOracle(question, { signal } = {}) {
  const startTime = performance.now()
  debugLog('ask.start', { questionLength: question.length })

  // Cancel any previous in-flight request
  if (activeController) {
    debugLog('ask.cancel_previous')
    activeController.abort()
  }

  // Create a new controller (combine with external signal if provided)
  activeController = new AbortController()
  const internalSignal = activeController.signal

  // If an external signal is provided, listen for its abort
  if (signal) {
    signal.addEventListener('abort', () => activeController?.abort(), { once: true })
  }

  try {
    const { cardContext, episodeContext } = buildContext()

    const response = await fetchWithRetry(
      '/api/oracle',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, cardContext, episodeContext }),
      },
      { maxRetries: 2, signal: internalSignal }
    )

    const latencyMs = Math.round(performance.now() - startTime)
    debugLog('ask.response', { status: response.status, latencyMs })

    if (!response.ok) {
      let errorBody
      try {
        errorBody = await response.json()
      } catch {
        errorBody = {}
      }

      const classified = classifyError(errorBody.code, response.status)
      debugLog('ask.api_error', { status: response.status, code: errorBody.code, classified })
      recordTelemetry('failure', latencyMs)

      // For recoverable errors, return error in response (don't fall back to demo)
      // For server errors without API key, fall back to demo
      if (errorBody.code === 'API_KEY_MISSING') {
        debugLog('ask.fallback_demo', { reason: 'no_api_key' })
        return getDemoResponse(question)
      }

      return {
        answer: `⚠️ ${classified.message}\n\n💡 **What to do:** ${classified.suggestion}`,
        sources: [],
        error: classified,
      }
    }

    // --- Parse and validate response ---
    let data
    try {
      data = await response.json()
    } catch (parseErr) {
      debugLog('ask.response_parse_failed', { error: parseErr.message })
      recordTelemetry('failure', latencyMs)
      return {
        answer: "The Oracle's response was garbled. Please try asking again.",
        sources: [],
        error: { message: 'Malformed response', suggestion: 'Try again.' },
      }
    }

    // Validate response shape
    if (!data.answer || typeof data.answer !== 'string') {
      debugLog('ask.response_invalid_shape', { keys: Object.keys(data) })
      recordTelemetry('failure', latencyMs)
      return {
        answer: "The Oracle returned an unexpected response. Please try again.",
        sources: [],
        error: { message: 'Invalid response format', suggestion: 'Try again.' },
      }
    }

    // Validate sources array shape
    if (data.sources && Array.isArray(data.sources)) {
      data.sources = data.sources.filter(
        (s) => s && typeof s.guest === 'string' && typeof s.youtubeUrl === 'string'
      )
    } else {
      data.sources = []
    }

    recordTelemetry('success', latencyMs)
    debugLog('ask.success', { latencyMs, answerLength: data.answer.length, sourceCount: data.sources.length })
    return data
  } catch (err) {
    const latencyMs = Math.round(performance.now() - startTime)

    if (err.name === 'AbortError') {
      debugLog('ask.aborted', { latencyMs })
      throw err // Re-throw so the component can handle it
    }

    debugLog('ask.network_error', { error: err.message, latencyMs })
    recordTelemetry('failure', latencyMs)

    // Network failure — fall back to demo response
    debugLog('ask.fallback_demo', { reason: 'network_error' })
    return getDemoResponse(question)
  } finally {
    activeController = null
  }
}

/**
 * Cancel any in-flight Oracle request.
 * Call this on component unmount.
 */
export function cancelOracleRequest() {
  if (activeController) {
    debugLog('request.cancelled')
    activeController.abort()
    activeController = null
  }
}

// ─── Demo responses (offline/no-key fallback) ────────────────────────

function getDemoResponse(question) {
  debugLog('demo.response', { questionLength: question.length })
  const q = question.toLowerCase()

  if (q.includes('product-market fit') || q.includes('pmf')) {
    return {
      answer: `🔮 The stars of product wisdom converge strongly on this question...

**Product-market fit** is perhaps the most discussed concept across Lenny's Podcast episodes, and the wisdom is remarkably consistent.

According to **Todd Jackson** (former VP at Dropbox, Twitter, and Cover), PMF isn't binary — it's a spectrum. You feel it when customer demand starts pulling the product forward faster than you can push it.

**Casey Winters** emphasizes looking at **retention curves**. If your retention curve flattens (stops declining), you have some degree of PMF. If it keeps dropping to zero, you don't — no matter what your growth numbers say.

**Dalton Caldwell** from Y Combinator puts it simply: "If you have to ask whether you have PMF, you probably don't." When you truly have it, the demand is unmistakable.

The most practical framework comes from **Sean Ellis's** survey approach: ask users "How would you feel if you could no longer use this product?" If 40%+ say "very disappointed," you likely have PMF.

**Practical takeaway:** Stop looking at vanity metrics. Look at your retention curve, run the Sean Ellis survey, and pay attention to whether customers are coming to you or you're dragging them in.`,
      sources: [
        { guest: 'Todd Jackson', youtubeUrl: 'https://www.youtube.com/watch?v=example1' },
        { guest: 'Casey Winters', youtubeUrl: 'https://www.youtube.com/watch?v=example2' },
        { guest: 'Dalton Caldwell', youtubeUrl: 'https://www.youtube.com/watch?v=example3' },
      ],
      categories: ['Growth', 'Strategy'],
    }
  }

  if (q.includes('prioriti') || q.includes('roadmap')) {
    return {
      answer: `🔮 Ah, the eternal question of what to build next...

The podcast guests offer several battle-tested frameworks:

**RICE Scoring** (discussed by **Matt LeMay**): Score each initiative on **Reach × Impact × Confidence ÷ Effort**. It forces you to be honest about all four dimensions, not just the ones you're excited about.

**Teresa Torres** champions the **Opportunity Solution Tree**: start with your desired outcome, map the opportunities (unmet needs), then brainstorm solutions for each. This prevents the common trap of jumping straight to features.

**Christina Wodtke** reminds us that good **OKRs** are the foundation — if you don't know your objectives, no prioritization framework will save you.

**Annie Duke** adds crucial nuance: use **pre-mortems** alongside your prioritization. Imagine the project failed — what went wrong? This surfaces risks that frameworks miss.

**Practical takeaway:** Don't just score features — first align on outcomes (OKRs), map opportunities (OST), then prioritize solutions (RICE). And always run a pre-mortem on your top picks.`,
      sources: [
        { guest: 'Matt LeMay', youtubeUrl: 'https://www.youtube.com/watch?v=example4' },
        { guest: 'Teresa Torres', youtubeUrl: 'https://www.youtube.com/watch?v=example5' },
        { guest: 'Annie Duke', youtubeUrl: 'https://www.youtube.com/watch?v=example6' },
      ],
      categories: ['Strategy'],
    }
  }

  return {
    answer: `🔮 An intriguing question, seeker...

While I'm currently in demo mode (no Gemini API key configured), I can share that this topic has been explored across many of Lenny's 303 episodes.

To unlock the full Oracle experience with AI-powered answers drawing from all episodes, add your Gemini API key:

1. Get a free key from **Google AI Studio** (ai.google.dev)
2. Set it as \`VITE_GEMINI_API_KEY\` in your .env file
3. Or enter it in the app settings

The Oracle holds wisdom from guests like **Elena Verna** on growth, **Teresa Torres** on discovery, **Ben Horowitz** on leadership, and 300+ more product leaders.

**Practical takeaway:** Even without AI, explore the Daily Draw to discover frameworks from the podcast, and build your PM DNA profile as you learn.`,
    sources: [],
    categories: ['Strategy'],
  }
}
