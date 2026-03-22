import { motion } from 'framer-motion'
import { Layers, MessageCircle, Dna } from 'lucide-react'

const navItems = [
  { id: 'draw', label: 'Daily Draw', icon: Layers },
  { id: 'oracle', label: 'Ask Oracle', icon: MessageCircle },
  { id: 'dna', label: 'PM DNA', icon: Dna },
]

export default function Navigation({ currentView, setCurrentView }) {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-3"
    >
      <div className="max-w-2xl mx-auto flex items-center justify-between glass rounded-xl px-4 py-2">
        {/* Logo */}
        <button 
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(212, 165, 116, 0.2), rgba(110, 86, 207, 0.15))' }}>
            <span className="text-oracle-gold text-xs">✦</span>
          </div>
          <span 
            className="text-gold-gradient font-semibold text-sm hidden sm:block tracking-tight"
            style={{ fontFamily: "var(--font-serif)", fontSize: '16px' }}
          >
            The Oracle
          </span>
        </button>

        {/* Nav items */}
        <div className="flex gap-0.5">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`
                relative px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 cursor-pointer transition-all duration-200
                ${currentView === item.id 
                  ? 'text-oracle-gold' 
                  : 'text-oracle-text-dim hover:text-oracle-text'}
              `}
            >
              <item.icon className="w-3.5 h-3.5" />
              <span className="hidden sm:block">{item.label}</span>
              {currentView === item.id && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 rounded-lg"
                  style={{ background: 'rgba(212, 165, 116, 0.06)', border: '1px solid rgba(212, 165, 116, 0.12)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </motion.nav>
  )
}
