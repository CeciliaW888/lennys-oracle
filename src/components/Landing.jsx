import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function Landing({ onEnter }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex flex-col items-center justify-center px-4 relative z-10"
    >
      {/* Mystical orb */}
      <motion.div
        animate={{ 
          scale: [1, 1.05, 1],
          rotate: [0, 5, -5, 0],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="w-32 h-32 md:w-40 md:h-40 rounded-full mb-8 relative"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(255, 215, 0, 0.4), rgba(124, 58, 237, 0.3), rgba(15, 12, 41, 0.8))',
          boxShadow: '0 0 60px rgba(255, 215, 0, 0.2), 0 0 120px rgba(124, 58, 237, 0.15), inset 0 0 40px rgba(255, 215, 0, 0.1)',
        }}
      >
        <motion.div
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-2 rounded-full"
          style={{ background: 'radial-gradient(circle at 40% 40%, rgba(255, 215, 0, 0.3), transparent)' }}
        />
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-5xl md:text-7xl font-bold mb-4 text-center"
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        <span className="text-gold-gradient">Lenny's Oracle</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-lg md:text-xl text-oracle-text-dim text-center max-w-lg mb-2"
      >
        Product wisdom from 303 episodes, distilled into daily draws
      </motion.p>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.65, duration: 0.8 }}
        className="text-sm text-oracle-text-dim/60 text-center max-w-md mb-12"
      >
        50 PM frameworks • AI-powered answers • Your PM DNA profile
      </motion.p>

      {/* Enter button */}
      <motion.button
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(255, 215, 0, 0.3)' }}
        whileTap={{ scale: 0.95 }}
        onClick={onEnter}
        className="px-8 py-4 rounded-full glass-bright text-oracle-gold font-semibold text-lg tracking-wide flex items-center gap-3 cursor-pointer"
      >
        <Sparkles className="w-5 h-5" />
        Consult the Oracle
        <Sparkles className="w-5 h-5" />
      </motion.button>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 text-xs text-oracle-text-dim/40"
      >
        Built with wisdom from Lenny's Podcast
      </motion.p>
    </motion.div>
  )
}
