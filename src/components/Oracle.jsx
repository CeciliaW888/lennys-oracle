import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, ExternalLink, Loader2 } from 'lucide-react'
import { askOracle, cancelOracleRequest } from '../utils/gemini'

const SUGGESTED_QUESTIONS = [
  "How do I know if I have product-market fit?",
  "What's the best way to prioritize a roadmap?",
  "How should I run my first 1-on-1s as a new manager?",
  "What makes a great North Star Metric?",
  "How do growth loops work?",
  "When should a startup pivot?",
]

/** @type {number} Min question length */
const MIN_QUESTION_LENGTH = 3
/** @type {number} Max question length */
const MAX_QUESTION_LENGTH = 2000

function MessageBubble({ message, isUser }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-5`}
    >
      <div className={`max-w-[85%]`}>
        {!isUser && (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(212, 165, 116, 0.15), rgba(110, 86, 207, 0.1))' }}>
              <span className="text-oracle-gold text-[10px]">✦</span>
            </div>
            <span className="text-[10px] text-oracle-gold/60 font-mono tracking-wider uppercase">Oracle</span>
          </div>
        )}
        
        <div
          className={`rounded-xl px-4 py-3 ${
            isUser
              ? 'glass-bright text-oracle-text'
              : message.isError
                ? 'bg-red-950/30 border border-red-500/30 text-oracle-text'
                : 'bg-oracle-surface border border-oracle-border text-oracle-text'
          }`}
          style={isUser ? { borderBottomRightRadius: '0.375rem' } : { borderBottomLeftRadius: '0.375rem' }}
        >
          <div className="text-[13px] leading-[1.7] whitespace-pre-wrap oracle-response"
            dangerouslySetInnerHTML={{ 
              __html: message.text
                .replace(/\*\*(.*?)\*\*/g, '<strong class="text-oracle-gold/90 font-medium">$1</strong>')
                .replace(/\n/g, '<br/>')
            }}
          />

          {/* Sources */}
          {message.sources?.length > 0 && (
            <div className="mt-3 pt-3 border-t border-oracle-border">
              <p className="text-[10px] text-oracle-gold/50 mb-2 font-mono tracking-wider uppercase">Sources</p>
              <div className="flex flex-wrap gap-1.5">
                {message.sources.map((source, i) => (
                  <a
                    key={i}
                    href={source.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] bg-oracle-surface-raised border border-oracle-border text-oracle-text-dim hover:text-oracle-gold hover:border-oracle-gold/20 transition-all"
                  >
                    <ExternalLink className="w-2.5 h-2.5" />
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
      className="flex justify-start mb-5"
    >
      <div className="bg-oracle-surface border border-oracle-border rounded-xl px-4 py-3 flex items-center gap-2.5">
        <Loader2 className="w-3.5 h-3.5 text-oracle-gold/60 animate-spin" />
        <span className="text-[12px] text-oracle-text-dim">Consulting the transcripts...</span>
      </div>
    </motion.div>
  )
}

export default function Oracle({ onTrackExploration, onTrackQuestion }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      isUser: false,
      text: "I hold the knowledge of 303 episodes of Lenny's Podcast — from growth loops to leadership lessons.\n\nAsk me anything about product management, and I'll draw upon the wisdom of the guests who came before you.",
      sources: [],
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [validationError, setValidationError] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  /** @type {React.MutableRefObject<boolean>} Mounted flag for cleanup */
  const isMountedRef = useRef(true)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Cancel in-flight requests on unmount
  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
      cancelOracleRequest()
      console.debug('[oracle] component unmounted, cancelled pending requests')
    }
  }, [])

  /**
   * Validate user input before submitting.
   * @param {string} text - The trimmed question
   * @returns {string} Error message, or empty string if valid
   */
  const validateInput = useCallback((text) => {
    if (text.length < MIN_QUESTION_LENGTH) {
      return `Question too short (min ${MIN_QUESTION_LENGTH} characters)`
    }
    if (text.length > MAX_QUESTION_LENGTH) {
      return `Question too long (${text.length}/${MAX_QUESTION_LENGTH} characters)`
    }
    return ''
  }, [])

  /**
   * Handle input changes with live validation feedback.
   */
  const handleInputChange = useCallback((e) => {
    const value = e.target.value
    setInput(value)

    // Only show validation for too-long input (don't nag about short while typing)
    if (value.trim().length > MAX_QUESTION_LENGTH) {
      setValidationError(`${value.trim().length}/${MAX_QUESTION_LENGTH} characters`)
    } else {
      setValidationError('')
    }
  }, [])

  const handleSubmit = useCallback(async (e) => {
    e?.preventDefault()
    const question = input.trim()

    // Input validation
    const error = validateInput(question)
    if (error) {
      setValidationError(error)
      return
    }

    // Prevent double-submit
    if (isLoading) return

    setInput('')
    setValidationError('')
    setIsLoading(true)

    const userMsg = { id: Date.now(), isUser: true, text: question }
    setMessages(prev => [...prev, userMsg])

    onTrackQuestion()

    console.debug('[oracle] submitting question', { length: question.length })

    try {
      const response = await askOracle(question)

      // Guard: component may have unmounted during the await
      if (!isMountedRef.current) {
        console.debug('[oracle] response arrived after unmount, discarding')
        return
      }

      const oracleMsg = {
        id: Date.now() + 1,
        isUser: false,
        text: response.answer,
        sources: response.sources || [],
        isError: !!response.error,
      }
      setMessages(prev => [...prev, oracleMsg])

      if (response.categories) {
        response.categories.forEach(cat => onTrackExploration(cat))
      }
    } catch (err) {
      // Guard: component may have unmounted
      if (!isMountedRef.current) return

      // AbortError means the user navigated away — don't show error
      if (err.name === 'AbortError') {
        console.debug('[oracle] request was cancelled')
        return
      }

      console.error('[oracle] unexpected error', err)

      const errorMsg = {
        id: Date.now() + 1,
        isUser: false,
        text: "The signal is unclear... Something unexpected happened.\n\n💡 **What to do:** Check your internet connection and try again. If the problem persists, check the browser console for details.",
        sources: [],
        isError: true,
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false)
      }
    }
  }, [input, isLoading, validateInput, onTrackExploration, onTrackQuestion])

  const handleSuggestion = useCallback((q) => {
    setInput(q)
    setValidationError('')
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-20 pb-4 px-4 relative z-10 flex flex-col oracle-grain"
    >
      <div className="max-w-2xl mx-auto flex-1 flex flex-col w-full">
        {/* Header */}
        <motion.div
          initial={{ y: -15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-6"
        >
          <h2 
            className="text-3xl font-semibold mb-1 text-gold-gradient tracking-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Ask the Oracle
          </h2>
          <p className="text-oracle-text-muted text-[11px] font-mono tracking-wider">
            303 episodes · PM wisdom at your fingertips
          </p>
        </motion.div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-4 pr-1">
          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} isUser={msg.isUser} />
          ))}
          
          <AnimatePresence>
            {isLoading && <TypingIndicator />}
          </AnimatePresence>
          
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-4"
          >
            <p className="text-[10px] text-oracle-text-muted font-mono tracking-wider text-center mb-3 uppercase">Suggested</p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestion(q)}
                  disabled={isLoading}
                  className="px-3 py-1.5 rounded-lg text-[11px] bg-oracle-surface border border-oracle-border text-oracle-text-dim hover:text-oracle-gold hover:border-oracle-gold/20 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {q}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="glass-bright rounded-xl flex items-center pr-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Ask about product management..."
              className="flex-1 bg-transparent px-4 py-3.5 text-oracle-text placeholder:text-oracle-text-muted/50 outline-none text-[13px]"
              disabled={isLoading}
              maxLength={MAX_QUESTION_LENGTH + 100}
              aria-invalid={!!validationError}
              aria-describedby={validationError ? 'input-error' : undefined}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 rounded-lg text-oracle-gold disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer hover:bg-oracle-gold/10"
              aria-label="Submit question"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
          {/* Validation error */}
          {validationError && (
            <p id="input-error" className="text-red-400/80 text-[10px] mt-1.5 px-4 font-mono">
              {validationError}
            </p>
          )}
        </form>
      </div>
    </motion.div>
  )
}
