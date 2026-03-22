import { useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { Share2, Download, Trophy, Sparkles } from 'lucide-react'

const CATEGORIES = [
  { key: 'Growth', label: 'Growth', icon: '🌱', color: '#10b981', description: 'Acquisition, retention, loops' },
  { key: 'Strategy', label: 'Strategy', icon: '♟️', color: '#6366f1', description: 'Vision, prioritization, positioning' },
  { key: 'Design', label: 'Design', icon: '🎨', color: '#f43f5e', description: 'UX, discovery, user research' },
  { key: 'Leadership', label: 'Leadership', icon: '👑', color: '#f59e0b', description: 'People, communication, influence' },
  { key: 'Data', label: 'Data', icon: '📊', color: '#06b6d4', description: 'Metrics, analytics, experiments' },
  { key: 'Culture', label: 'Culture', icon: '🌍', color: '#a855f7', description: 'Values, process, team dynamics' },
]

function RadarChart({ data, size = 300 }) {
  const center = size / 2
  const radius = (size / 2) * 0.75
  const angleStep = (2 * Math.PI) / CATEGORIES.length
  
  // Normalize data to 0-1 range
  const maxVal = Math.max(...Object.values(data), 1)
  const normalizedData = CATEGORIES.map(cat => (data[cat.key] || 0) / maxVal)

  // Generate polygon points
  const points = CATEGORIES.map((_, i) => {
    const angle = i * angleStep - Math.PI / 2
    const value = normalizedData[i]
    return {
      x: center + Math.cos(angle) * radius * value,
      y: center + Math.sin(angle) * radius * value,
    }
  })

  const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ')

  // Grid levels
  const levels = [0.25, 0.5, 0.75, 1]

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {/* Grid */}
      {levels.map((level, li) => {
        const gridPoints = CATEGORIES.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2
          return `${center + Math.cos(angle) * radius * level},${center + Math.sin(angle) * radius * level}`
        }).join(' ')
        return (
          <polygon
            key={li}
            points={gridPoints}
            fill="none"
            stroke="rgba(255, 215, 0, 0.1)"
            strokeWidth="1"
          />
        )
      })}

      {/* Axis lines */}
      {CATEGORIES.map((cat, i) => {
        const angle = i * angleStep - Math.PI / 2
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={center + Math.cos(angle) * radius}
            y2={center + Math.sin(angle) * radius}
            stroke="rgba(255, 215, 0, 0.1)"
            strokeWidth="1"
          />
        )
      })}

      {/* Data polygon */}
      <motion.polygon
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        points={polygonPoints}
        fill="rgba(255, 215, 0, 0.15)"
        stroke="#ffd700"
        strokeWidth="2"
        style={{ transformOrigin: `${center}px ${center}px` }}
      />

      {/* Data points */}
      {points.map((point, i) => (
        <motion.circle
          key={i}
          initial={{ opacity: 0, r: 0 }}
          animate={{ opacity: 1, r: 4 }}
          transition={{ delay: 0.5 + i * 0.1 }}
          cx={point.x}
          cy={point.y}
          fill={CATEGORIES[i].color}
          stroke="#fff"
          strokeWidth="1"
        />
      ))}

      {/* Labels */}
      {CATEGORIES.map((cat, i) => {
        const angle = i * angleStep - Math.PI / 2
        const labelRadius = radius + 28
        const x = center + Math.cos(angle) * labelRadius
        const y = center + Math.sin(angle) * labelRadius
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="12"
            fill={cat.color}
            fontWeight="600"
          >
            {cat.icon} {cat.label}
          </text>
        )
      })}
    </svg>
  )
}

function getPmArchetype(data) {
  const maxVal = Math.max(...Object.values(data))
  if (maxVal === 0) return { name: 'Seeking Wisdom', description: 'Start exploring to discover your PM DNA!' }
  
  const sorted = Object.entries(data).sort(([,a], [,b]) => b - a)
  const top = sorted[0][0]
  const second = sorted[1][0]
  
  const archetypes = {
    'Growth': { name: 'The Growth Alchemist', description: 'You\'re drawn to loops, metrics, and scaling — a true growth engine.' },
    'Strategy': { name: 'The Strategic Architect', description: 'You see the big picture and know where the pieces fit.' },
    'Design': { name: 'The Empathy Builder', description: 'Users are your compass. You build what they truly need.' },
    'Leadership': { name: 'The People Catalyst', description: 'You unlock potential in others and lead by influence.' },
    'Data': { name: 'The Signal Finder', description: 'You cut through noise to find truth in the numbers.' },
    'Culture': { name: 'The Culture Weaver', description: 'You know great products come from great teams.' },
  }
  
  return archetypes[top] || archetypes['Strategy']
}

export default function PmDna({ userProfile }) {
  const canvasRef = useRef(null)
  const data = userProfile.explorationHistory
  const totalExplorations = Object.values(data).reduce((sum, v) => sum + v, 0)
  const archetype = getPmArchetype(data)

  const handleShare = async () => {
    const text = `🔮 My PM DNA from Lenny's Oracle:\n\n` +
      CATEGORIES.map(cat => `${cat.icon} ${cat.label}: ${'█'.repeat(Math.min(data[cat.key] || 0, 10))} (${data[cat.key] || 0})`).join('\n') +
      `\n\n✨ Archetype: ${archetype.name}\n\nDiscover yours at lennys-oracle.vercel.app`

    if (navigator.share) {
      try {
        await navigator.share({ text })
      } catch {}
    } else {
      navigator.clipboard?.writeText(text)
      alert('PM DNA copied to clipboard!')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-20 pb-12 px-4 relative z-10"
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h2 
            className="text-3xl md:text-4xl font-bold mb-2 text-gold-gradient"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Your PM DNA
          </h2>
          <p className="text-oracle-text-dim">
            {totalExplorations > 0 
              ? `Based on ${totalExplorations} explorations across ${userProfile.draws.length} readings`
              : 'Draw your daily cards and ask the Oracle to build your profile'
            }
          </p>
        </motion.div>

        {/* Archetype */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-bright rounded-2xl p-6 text-center mb-8"
        >
          <Trophy className="w-8 h-8 text-oracle-gold mx-auto mb-3" />
          <h3 
            className="text-2xl font-bold text-oracle-gold mb-2"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {archetype.name}
          </h3>
          <p className="text-oracle-text-dim">{archetype.description}</p>
        </motion.div>

        {/* Radar Chart */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="glass rounded-2xl p-6 mb-8"
          ref={canvasRef}
        >
          <RadarChart data={data} size={320} />
        </motion.div>

        {/* Category breakdown */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-3 mb-8"
        >
          {CATEGORIES.map((cat, i) => {
            const value = data[cat.key] || 0
            const maxVal = Math.max(...Object.values(data), 1)
            const pct = (value / maxVal) * 100

            return (
              <motion.div
                key={cat.key}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 + i * 0.08 }}
                className="glass rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{cat.icon}</span>
                    <div>
                      <span className="text-sm font-semibold" style={{ color: cat.color }}>{cat.label}</span>
                      <p className="text-xs text-oracle-text-dim">{cat.description}</p>
                    </div>
                  </div>
                  <span className="text-sm font-mono text-oracle-text-dim">{value}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.8 + i * 0.08, duration: 0.6 }}
                    className="h-full rounded-full"
                    style={{ background: cat.color }}
                  />
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Share button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <button
            onClick={handleShare}
            className="px-6 py-3 rounded-full glass-bright text-oracle-gold font-medium flex items-center gap-2 mx-auto cursor-pointer hover:bg-white/15 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share Your PM DNA
          </button>
        </motion.div>
      </div>
    </motion.div>
  )
}
