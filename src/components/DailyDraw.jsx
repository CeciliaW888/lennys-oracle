import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, Share2, ExternalLink, Sparkles } from 'lucide-react'
import cards from '../data/cards.json'

const CATEGORY_COLORS = {
  Growth: '#10b981',
  Strategy: '#6366f1',
  Design: '#f43f5e',
  Leadership: '#f59e0b',
  Data: '#06b6d4',
  Culture: '#a855f7',
}

const CATEGORY_ICONS = {
  Growth: '🌱',
  Strategy: '♟️',
  Design: '🎨',
  Leadership: '👑',
  Data: '📊',
  Culture: '🌍',
}

function seededRandom(seed) {
  let x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function getDailyCards() {
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  const shuffled = [...cards].sort((a, b) => seededRandom(seed + cards.indexOf(a)) - seededRandom(seed + cards.indexOf(b)))
  return shuffled.slice(0, 3)
}

function TarotCard({ card, index, isFlipped, onFlip, onTrack }) {
  const cardRef = useRef(null)

  const handleFlip = () => {
    if (!isFlipped) {
      onFlip(index)
      if (card.category) onTrack(card.category)
    }
  }

  const catColor = CATEGORY_COLORS[card.category] || '#ffd700'

  return (
    <motion.div
      initial={{ y: 60, opacity: 0, rotateZ: (index - 1) * 5 }}
      animate={{ y: 0, opacity: 1, rotateZ: 0 }}
      transition={{ delay: 0.2 + index * 0.15, duration: 0.6, ease: 'easeOut' }}
      className="w-full max-w-[280px] aspect-[2/3] perspective-1000 cursor-pointer"
      onClick={handleFlip}
      ref={cardRef}
    >
      <div className={`card-inner w-full h-full relative ${isFlipped ? 'flipped' : ''}`}>
        {/* Card Back (face down) */}
        <div className="card-front absolute inset-0 rounded-2xl overflow-hidden gold-glow">
          <div 
            className="w-full h-full flex flex-col items-center justify-center p-6"
            style={{ 
              background: 'linear-gradient(135deg, #1a1145 0%, #2d1b69 50%, #1a1145 100%)',
              border: '2px solid rgba(255, 215, 0, 0.3)',
              borderRadius: '1rem',
            }}
          >
            {/* Decorative pattern */}
            <div className="absolute inset-4 border border-oracle-gold/20 rounded-xl" />
            <div className="absolute inset-8 border border-oracle-gold/10 rounded-lg" />
            
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="text-5xl mb-4 opacity-60"
            >
              ✦
            </motion.div>
            
            <p className="text-oracle-gold/60 text-sm font-medium tracking-[0.2em] uppercase">
              Tap to Reveal
            </p>
            
            <motion.div
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-4 text-oracle-gold/40 text-xs"
            >
              {['Past', 'Present', 'Future'][index]}
            </motion.div>
          </div>
        </div>

        {/* Card Front (face up) */}
        <div className="card-back absolute inset-0 rounded-2xl overflow-hidden">
          <div 
            className="w-full h-full flex flex-col p-5 relative"
            style={{ 
              background: 'linear-gradient(160deg, rgba(15, 12, 41, 0.95) 0%, rgba(48, 43, 99, 0.95) 100%)',
              border: `2px solid ${catColor}40`,
              borderRadius: '1rem',
            }}
          >
            {/* Category badge */}
            <div 
              className="self-start px-3 py-1 rounded-full text-xs font-semibold mb-3 flex items-center gap-1"
              style={{ background: `${catColor}20`, color: catColor, border: `1px solid ${catColor}30` }}
            >
              {CATEGORY_ICONS[card.category]} {card.category}
            </div>

            {/* Framework name */}
            <h3 
              className="text-xl font-bold mb-2 leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#ffd700' }}
            >
              {card.framework}
            </h3>

            {/* Description */}
            <p className="text-oracle-text-dim text-sm mb-4 leading-relaxed">
              {card.description}
            </p>

            {/* Quote */}
            <div className="flex-1 flex items-center">
              <blockquote className="text-sm italic text-oracle-text/80 leading-relaxed border-l-2 pl-3" style={{ borderColor: `${catColor}60` }}>
                "{card.quote?.length > 180 ? card.quote.substring(0, 177) + '...' : card.quote}"
              </blockquote>
            </div>

            {/* Guest attribution */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-oracle-text">{card.guest}</p>
                <p className="text-xs text-oracle-text-dim">Lenny's Podcast</p>
              </div>
              {card.youtubeUrl && (
                <a
                  href={card.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-oracle-text-dim hover:text-oracle-gold transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function DailyDraw({ userProfile, onSaveDraw, onTrackExploration }) {
  const [dailyCards, setDailyCards] = useState([])
  const [flippedCards, setFlippedCards] = useState(new Set())
  const [allRevealed, setAllRevealed] = useState(false)

  useEffect(() => {
    const cards = getDailyCards()
    setDailyCards(cards)
    
    // Check if already drawn today
    const today = new Date().toISOString().split('T')[0]
    const todayDraw = userProfile.draws.find(d => d.date === today)
    if (todayDraw) {
      setFlippedCards(new Set([0, 1, 2]))
      setAllRevealed(true)
    }
  }, [])

  const handleFlip = (index) => {
    setFlippedCards(prev => {
      const next = new Set(prev)
      next.add(index)
      
      if (next.size === 3 && !allRevealed) {
        setAllRevealed(true)
        onSaveDraw(dailyCards)
      }
      
      return next
    })
  }

  const today = new Date()
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-20 pb-12 px-4 relative z-10"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 
            className="text-3xl md:text-4xl font-bold mb-2 text-gold-gradient"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Your Daily Draw
          </h2>
          <p className="text-oracle-text-dim">{dateStr}</p>
          {!allRevealed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-oracle-gold/60 text-sm mt-2"
            >
              Tap each card to reveal today's wisdom
            </motion.p>
          )}
        </motion.div>

        {/* Cards */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
          {dailyCards.map((card, index) => (
            <TarotCard
              key={card.id}
              card={card}
              index={index}
              isFlipped={flippedCards.has(index)}
              onFlip={handleFlip}
              onTrack={onTrackExploration}
            />
          ))}
        </div>

        {/* All revealed message */}
        <AnimatePresence>
          {allRevealed && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-10"
            >
              <div className="glass rounded-2xl p-6 max-w-lg mx-auto">
                <Sparkles className="w-6 h-6 text-oracle-gold mx-auto mb-3" />
                <p className="text-oracle-text mb-1">
                  Today's reading: <span className="text-oracle-gold font-semibold">{dailyCards.map(c => c.framework).join(' • ')}</span>
                </p>
                <p className="text-oracle-text-dim text-sm">
                  The cards suggest a focus on {dailyCards[0]?.category?.toLowerCase()} and {dailyCards[1]?.category?.toLowerCase()} today.
                </p>
                <p className="text-oracle-text-dim/50 text-xs mt-4">
                  New cards appear each day at midnight
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
