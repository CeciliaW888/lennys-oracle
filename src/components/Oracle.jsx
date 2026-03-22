import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, ExternalLink, Loader2 } from 'lucide-react'
import { askOracle } from '../utils/gemini'

const SUGGESTED_QUESTIONS = [
  "How do I know if I have product-market fit?",
  "What's the best way to prioritize a roadmap?",
  "How should I run my first 1-on-1s as a new manager?",
  "What makes a great North Star Metric?",
  "How do growth loops work?",
  "When should a startup pivot?",
]

function MessageBubble({ message, isUser }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`max-w-[85%] ${isUser ? 'order-1' : 'order-1'}`}>
        {!isUser && (
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(255, 215, 0, 0.2)' }}>
              <Sparkles className="w-3 h-3 text-oracle-gold" />
            </div>
            <span className="text-xs text-oracle-gold/80 font-medium">Oracle</span>
          </div>
        )}
        
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'glass-bright text-oracle-text'
              : 'glass text-oracle-text'
          }`}
          style={isUser ? { borderBottomRightRadius: '0.5rem' } : { borderBottomLeftRadius: '0.5rem' }}
        >
          {/* Render message with formatting */}
          <div className="text-sm leading-relaxed whitespace-pre-wrap oracle-response">
            {message.text}
          </div>

          {/* Sources */}
          {message.sources?.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <p className="text-xs text-oracle-gold/70 mb-2 font-medium">📚 Sources</p>
              <div className="flex flex-wrap gap-2">
                {message.sources.map((source, i) => (
                  <a
                    key={i}
                    href={source.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-white/5 hover:bg-white/10 text-oracle-text-dim hover:text-oracle-gold transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {source.guest}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex justify-start mb-4"
    >
      <div className="glass rounded-2xl px-4 py-3 flex items-center gap-2">
        <Loader2 className="w-4 h-4 text-oracle-gold animate-spin" />
        <span className="text-sm text-oracle-text-dim">The Oracle is consulting the transcripts...</span>
      </div>
    </motion.div>
  )
}

export default function Oracle({ onTrackExploration, onTrackQuestion }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      isUser: false,
      text: "Welcome, seeker of product wisdom. I hold the knowledge of 303 episodes of Lenny's Podcast — from growth loops to leadership lessons. Ask me anything about product management, and I shall draw upon the wisdom of the guests who came before you.",
      sources: [],
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e) => {
    e?.preventDefault()
    const question = input.trim()
    if (!question || isLoading) return

    setInput('')
    setIsLoading(true)

    // Add user message
    const userMsg = { id: Date.now(), isUser: true, text: question }
    setMessages(prev => [...prev, userMsg])

    onTrackQuestion()

    try {
      const response = await askOracle(question)
      
      const oracleMsg = {
        id: Date.now() + 1,
        isUser: false,
        text: response.answer,
        sources: response.sources || [],
      }
      setMessages(prev => [...prev, oracleMsg])

      // Track categories from sources
      if (response.categories) {
        response.categories.forEach(cat => onTrackExploration(cat))
      }
    } catch (err) {
      const errorMsg = {
        id: Date.now() + 1,
        isUser: false,
        text: "The cosmic signal is unclear... I couldn't reach the transcripts. Please check that a Gemini API key is configured and try again.",
        sources: [],
      }
      setMessages(prev => [...prev, errorMsg])
    }

    setIsLoading(false)
  }

  const handleSuggestion = (q) => {
    setInput(q)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-20 pb-4 px-4 relative z-10 flex flex-col"
    >
      <div className="max-w-2xl mx-auto flex-1 flex flex-col w-full">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <h2 
            className="text-3xl font-bold mb-1 text-gold-gradient"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Ask the Oracle
          </h2>
          <p className="text-oracle-text-dim text-sm">
            303 episodes of PM wisdom at your fingertips
          </p>
        </motion.div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-4 pr-1 space-y-1">
          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} isUser={msg.isUser} />
          ))}
          
          <AnimatePresence>
            {isLoading && <TypingIndicator />}
          </AnimatePresence>
          
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions (show when few messages) */}
        {messages.length <= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-4"
          >
            <p className="text-xs text-oracle-text-dim/60 mb-2 text-center">Try asking:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestion(q)}
                  className="px-3 py-1.5 rounded-full text-xs glass text-oracle-text-dim hover:text-oracle-gold hover:border-oracle-gold/30 transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="glass-bright rounded-2xl flex items-center pr-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about product management..."
              className="flex-1 bg-transparent px-5 py-4 text-oracle-text placeholder:text-oracle-text-dim/40 outline-none text-sm"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-xl bg-oracle-gold/20 text-oracle-gold hover:bg-oracle-gold/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  )
}
