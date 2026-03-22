import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import cards from '../data/cards.json'

const CATEGORY_COLORS = {
  Growth: '#30a46c',
  Strategy: '#6e56cf',
  Design: '#e5484d',
  Leadership: '#d4a574',
  Data: '#3e63dd',
  Culture: '#ab4aba',
}

const CATEGORY_ICONS = {
  Growth: '◆',
  Strategy: '◈',
  Design: '○',
  Leadership: '△',
  Data: '□',
  Culture: '⬡',
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

  const catColor = CATEGORY_COLORS[card.category] || '#d4a574'
  const positions = ['Past', 'Present', 'Future']

  return (
    <motion.div
      initial={{ y: 60, opacity: 0, rotateZ: (index - 1) * 3 }}
      animate={{ y: 0, opacity: 1, rotateZ: 0 }}
      transition={{ delay: 0.3 + index * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-[260px] aspect-[2/3] perspective-1000 cursor-pointer group"
      onClick={handleFlip}
      ref={cardRef}
    >
      <div className={`card-inner w-full h-full relative ${isFlipped ? 'flipped' : ''}`}>
        {/* Card Back */}
        <div className="card-front absolute inset-0 rounded-2xl overflow-hidden foil-effect">
          <div 
            className="w-full h-full flex flex-col items-center justify-center p-6 relative"
            style={{ 
              background: 'linear-gradient(160deg, #111114 0%, #18181c 50%, #111114 100%)',
              border: '1px solid rgba(212, 165, 116, 0.12)',
              borderRadius: '1rem',
            }}
          >
            {/* Geometric border pattern */}
            <div className="absolute inset-3 border border-oracle-gold/8 rounded-xl" />
            <div className="absolute inset-6 border border-oracle-gold/5 rounded-lg" />
            
            {/* Center symbol */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="text-3xl mb-5 text-oracle-gold/30"
            >
              ✦
            </motion.div>
            
            <p className="text-oracle-gold/40 text-[10px] font-mono tracking-[0.3em] uppercase">
              Tap to Reveal
            </p>
            
            <motion.div
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="mt-4 text-oracle-gold/25 text-[10px] font-mono tracking-wider"
            >
              {positions[index]}
            </motion.div>

            {/* Corner accents */}
            <div className="absolute top-3 left-3 w-4 h-4 border-l border-t border-oracle-gold/10 rounded-tl-md" />
            <div className="absolute top-3 right-3 w-4 h-4 border-r border-t border-oracle-gold/10 rounded-tr-md" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-l border-b border-oracle-gold/10 rounded-bl-md" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-r border-b border-oracle-gold/10 rounded-br-md" />
          </div>
        </div>

        {/* Card Front (revealed) */}
        <div className="card-back absolute inset-0 rounded-2xl overflow-hidden foil-effect">
          <div 
            className="w-full h-full flex flex-col p-5 relative"
            style={{ 
              background: `linear-gradient(160deg, #111114 0%, #18181c 100%)`,
              border: `1px solid ${catColor}20`,
              borderRadius: '1rem',
            }}
          >
            {/* Subtle top glow */}
            <div className="absolute top-0 left-0 right-0 h-24 opacity-30" style={{ background: `radial-gradient(ellipse at 50% 0%, ${catColor}10, transparent)` }} />

            {/* Category badge */}
            <div 
              className="self-start px-2.5 py-1 rounded-md text-[10px] font-mono font-medium mb-3 flex items-center gap-1.5 tracking-wider uppercase"
              style={{ background: `${catColor}10`, color: catColor, border: `1px solid ${catColor}15` }}
            >
              {CATEGORY_ICONS[card.category]} {card.category}
            </div>

            {/* Framework name */}
            <h3 
              className="text-xl font-semibold mb-2 leading-tight tracking-tight"
              style={{ fontFamily: "var(--font-serif)", color: 'var(--color-oracle-gold-bright)' }}
            >
              {card.framework}
            </h3>

            {/* Description */}
            <p className="text-oracle-text-dim text-[13px] mb-4 leading-relaxed">
              {card.description}
            </p>

            {/* Quote */}
            <div className="flex-1 flex items-center">
              <blockquote className="text-[12px] italic text-oracle-text/70 leading-relaxed pl-3 relative">
                <div className="absolute left-0 top-0 bottom-0 w-px" style={{ background: `linear-gradient(to bottom, ${catColor}40, transparent)` }} />
                "{card.quote?.length > 160 ? card.quote.substring(0, 157) + '...' : card.quote}"
              </blockquote>
            </div>

            {/* Guest attribution */}
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-oracle-text">{card.guest}</p>
                <p className="text-[10px] text-oracle-text-muted font-mono tracking-wider">Lenny's Podcast</p>
              </div>
              {card.youtubeUrl && (
                <a
                  href={card.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-7 h-7 rounded-md flex items-center justify-center text-oracle-text-muted hover:text-oracle-gold hover:bg-oracle-gold/5 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
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
      className="min-h-screen pt-20 pb-12 px-4 relative z-10 oracle-grain"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-[10px] font-mono text-oracle-text-muted tracking-[0.3em] uppercase mb-2">{dateStr}</p>
          <h2 
            className="text-3xl md:text-5xl font-semibold mb-3 text-gold-gradient tracking-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Your Daily Draw
          </h2>
          {!allRevealed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-oracle-text-muted text-sm"
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
              className="text-center mt-12"
            >
              <div className="glass rounded-xl p-6 max-w-lg mx-auto">
                <div className="w-8 h-8 rounded-lg mx-auto mb-3 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(212, 165, 116, 0.1), rgba(110, 86, 207, 0.08))' }}>
                  <span className="text-oracle-gold text-sm">✦</span>
                </div>
                <p className="text-oracle-text text-sm mb-1">
                  Today's reading: <span className="text-oracle-gold font-medium">{dailyCards.map(c => c.framework).join(' · ')}</span>
                </p>
                <p className="text-oracle-text-dim text-xs leading-relaxed">
                  The cards suggest a focus on {dailyCards[0]?.category?.toLowerCase()} and {dailyCards[1]?.category?.toLowerCase()} today.
                </p>
                <p className="text-oracle-text-muted text-[10px] mt-4 font-mono tracking-wider">
                  New cards at midnight
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
