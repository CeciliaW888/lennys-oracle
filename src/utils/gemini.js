import { GoogleGenerativeAI } from '@google/generative-ai'
import episodes from '../data/episodes.json'
import cards from '../data/cards.json'

// Get API key from env or localStorage
function getApiKey() {
  return import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('gemini-api-key') || ''
}

// Build context from cards and episodes for the oracle
function buildContext() {
  const cardContext = cards.map(c => 
    `Framework: ${c.framework} (${c.category})\nDescription: ${c.description}\nQuote: "${c.quote}"\nGuest: ${c.guest}\nEpisode: ${c.episodeSlug}\nYouTube: ${c.youtubeUrl}`
  ).join('\n\n')

  const episodeContext = episodes.slice(0, 100).map(ep =>
    `Guest: ${ep.guest} | Title: ${ep.title} | YouTube: ${ep.youtubeUrl}`
  ).join('\n')

  return { cardContext, episodeContext }
}

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

export async function askOracle(question) {
  const apiKey = getApiKey()
  
  if (!apiKey) {
    // Demo mode - provide a static but useful response
    return getDemoResponse(question)
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      systemInstruction: SYSTEM_PROMPT,
    })

    const { cardContext, episodeContext } = buildContext()

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

    // Parse sources from response
    let answer = text
    let sources = []
    
    const sourcesMatch = text.match(/\[SOURCES\]\s*([\s\S]*?)\s*\[\/SOURCES\]/)
    if (sourcesMatch) {
      answer = text.replace(/\[SOURCES\][\s\S]*?\[\/SOURCES\]/, '').trim()
      try {
        sources = JSON.parse(sourcesMatch[1])
      } catch {}
    }

    // Detect categories mentioned
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

    return { answer, sources, categories }
  } catch (err) {
    console.error('Oracle error:', err)
    return getDemoResponse(question)
  }
}

// Demo responses when no API key is configured
function getDemoResponse(question) {
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

  // Generic response
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
