import { motion } from 'framer-motion'
import { Layers, MessageCircle, Dna, Sparkles } from 'lucide-react'

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
      <div className="max-w-2xl mx-auto flex items-center justify-between glass rounded-2xl px-4 py-2">
        {/* Logo */}
        <button 
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-5 h-5 text-oracle-gold" />
          <span 
            className="text-gold-gradient font-bold text-lg hidden sm:block"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Lenny's Oracle
          </span>
        </button>

        {/* Nav items */}
        <div className="flex gap-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`
                relative px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-2 cursor-pointer transition-colors
                ${currentView === item.id 
                  ? 'text-oracle-gold' 
                  : 'text-oracle-text-dim hover:text-oracle-text'}
              `}
            >
              <item.icon className="w-4 h-4" />
              <span className="hidden sm:block">{item.label}</span>
              {currentView === item.id && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: 'rgba(255, 215, 0, 0.1)', border: '1px solid rgba(255, 215, 0, 0.2)' }}
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
