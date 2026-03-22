import { useMemo, useRef } from 'react'
import { motion } from 'framer-motion'
import { Share2, Trophy } from 'lucide-react'

const CATEGORIES = [
  { key: 'Growth', label: 'Growth', icon: '◆', color: '#30a46c', description: 'Acquisition, retention, loops' },
  { key: 'Strategy', label: 'Strategy', icon: '◈', color: '#6e56cf', description: 'Vision, prioritization, positioning' },
  { key: 'Design', label: 'Design', icon: '○', color: '#e5484d', description: 'UX, discovery, user research' },
  { key: 'Leadership', label: 'Leadership', icon: '△', color: '#d4a574', description: 'People, communication, influence' },
  { key: 'Data', label: 'Data', icon: '□', color: '#3e63dd', description: 'Metrics, analytics, experiments' },
  { key: 'Culture', label: 'Culture', icon: '⬡', color: '#ab4aba', description: 'Values, process, team dynamics' },
]

function RadarChart({ data, size = 320 }) {
  const center = size / 2
  const radius = (size / 2) * 0.72
  const angleStep = (2 * Math.PI) / CATEGORIES.length
  
  const maxVal = Math.max(...Object.values(data), 1)
  const normalizedData = CATEGORIES.map(cat => (data[cat.key] || 0) / maxVal)

  const points = CATEGORIES.map((_, i) => {
    const angle = i * angleStep - Math.PI / 2
    const value = normalizedData[i]
    return {
      x: center + Math.cos(angle) * radius * value,
      y: center + Math.sin(angle) * radius * value,
    }
  })

  const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ')
  const levels = [0.25, 0.5, 0.75, 1]

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      <defs>
        <linearGradient id="radar-fill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4a574" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#6e56cf" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="radar-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4a574" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#6e56cf" stopOpacity="0.6" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

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
            stroke="rgba(212, 165, 116, 0.06)"
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
            stroke="rgba(212, 165, 116, 0.06)"
            strokeWidth="1"
          />
        )
      })}

      {/* Data polygon */}
      <motion.polygon
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        points={polygonPoints}
        fill="url(#radar-fill)"
        stroke="url(#radar-stroke)"
        strokeWidth="1.5"
        filter="url(#glow)"
        style={{ transformOrigin: `${center}px ${center}px` }}
      />

      {/* Data points — glowing nodes */}
      {points.map((point, i) => (
        <g key={i}>
          <motion.circle
            initial={{ opacity: 0, r: 0 }}
            animate={{ opacity: 0.3, r: 8 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            cx={point.x}
            cy={point.y}
            fill={CATEGORIES[i].color}
            opacity="0.15"
          />
          <motion.circle
            initial={{ opacity: 0, r: 0 }}
            animate={{ opacity: 1, r: 3.5 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            cx={point.x}
            cy={point.y}
            fill={CATEGORIES[i].color}
            stroke="rgba(8, 8, 10, 0.5)"
            strokeWidth="1"
          />
        </g>
      ))}

      {/* Labels */}
      {CATEGORIES.map((cat, i) => {
        const angle = i * angleStep - Math.PI / 2
        const labelRadius = radius + 30
        const x = center + Math.cos(angle) * labelRadius
        const y = center + Math.sin(angle) * labelRadius
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="11"
            fill={cat.color}
            fontWeight="500"
            fontFamily="var(--font-sans)"
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
  if (maxVal === 0) return { name: 'Seeking Wisdom', description: 'Start exploring to discover your PM DNA' }
  
  const sorted = Object.entries(data).sort(([,a], [,b]) => b - a)
  const top = sorted[0][0]
  
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
    const text = `✦ My PM DNA from Lenny's Oracle:\n\n` +
      CATEGORIES.map(cat => `${cat.icon} ${cat.label}: ${'█'.repeat(Math.min(data[cat.key] || 0, 10))} (${data[cat.key] || 0})`).join('\n') +
      `\n\n${archetype.name}\n\nDiscover yours → lennys-oracle.vercel.app`

    if (navigator.share) {
      try { await navigator.share({ text }) } catch {}
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
      className="min-h-screen pt-20 pb-12 px-4 relative z-10 oracle-grain"
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <p className="text-[10px] font-mono text-oracle-text-muted tracking-[0.3em] uppercase mb-2">Your Profile</p>
          <h2 
            className="text-3xl md:text-5xl font-semibold mb-3 text-gold-gradient tracking-tight"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            PM DNA
          </h2>
          <p className="text-oracle-text-dim text-sm">
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
          className="relative rounded-xl p-6 text-center mb-8 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-oracle-gold/5 via-oracle-surface to-oracle-purple/5" />
          <div className="absolute inset-0 border border-oracle-gold/10 rounded-xl" />
          <div className="relative">
            <div className="w-10 h-10 rounded-lg mx-auto mb-3 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(212, 165, 116, 0.12), rgba(110, 86, 207, 0.08))' }}>
              <Trophy className="w-5 h-5 text-oracle-gold/80" />
            </div>
            <h3 
              className="text-2xl font-semibold text-oracle-gold-bright mb-2 tracking-tight"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              {archetype.name}
            </h3>
            <p className="text-oracle-text-dim text-sm">{archetype.description}</p>
          </div>
        </motion.div>

        {/* Radar Chart */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="glass rounded-xl p-6 mb-8"
          ref={canvasRef}
        >
          <RadarChart data={data} size={320} />
        </motion.div>

        {/* Category breakdown */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-2.5 mb-8"
        >
          {CATEGORIES.map((cat, i) => {
            const value = data[cat.key] || 0
            const maxVal = Math.max(...Object.values(data), 1)
            const pct = (value / maxVal) * 100

            return (
              <motion.div
                key={cat.key}
                initial={{ x: -15, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 + i * 0.06 }}
                className="bg-oracle-surface border border-oracle-border rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm" style={{ color: cat.color }}>{cat.icon}</span>
                    <div>
                      <span className="text-xs font-medium" style={{ color: cat.color }}>{cat.label}</span>
                      <p className="text-[10px] text-oracle-text-muted">{cat.description}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-oracle-text-dim">{value}</span>
                </div>
                <div className="h-1 rounded-full bg-oracle-border overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.8 + i * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full"
                    style={{ 
                      background: cat.color,
                      boxShadow: `0 0 8px ${cat.color}30`,
                    }}
                  />
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Share button */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <button
            onClick={handleShare}
            className="group px-6 py-3 rounded-xl font-medium text-sm flex items-center gap-2 mx-auto cursor-pointer transition-all"
            style={{
              background: 'linear-gradient(135deg, rgba(212, 165, 116, 0.08), rgba(110, 86, 207, 0.05))',
              border: '1px solid rgba(212, 165, 116, 0.15)',
              color: 'var(--color-oracle-gold)',
            }}
          >
            <Share2 className="w-4 h-4" />
            Share Your PM DNA
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </button>
        </motion.div>
      </div>
    </motion.div>
  )
}
