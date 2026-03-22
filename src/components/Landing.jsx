import { motion } from 'framer-motion'

export default function Landing({ onEnter }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen flex flex-col items-center justify-center px-4 relative z-10 oracle-grain"
    >
      {/* Ambient light effects */}
      <div className="absolute top-[10%] left-[15%] w-[400px] h-[400px] rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, #d4a574, transparent 70%)' }} />
      <div className="absolute bottom-[15%] right-[10%] w-[350px] h-[350px] rounded-full opacity-[0.03]" style={{ background: 'radial-gradient(circle, #6e56cf, transparent 70%)' }} />

      {/* Orb — refined, less cheesy */}
      <motion.div
        animate={{ 
          scale: [1, 1.03, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="w-28 h-28 md:w-36 md:h-36 rounded-full mb-10 relative"
        style={{
          background: 'radial-gradient(circle at 35% 35%, rgba(212, 165, 116, 0.2), rgba(110, 86, 207, 0.1), rgba(8, 8, 10, 0.9))',
          boxShadow: '0 0 40px rgba(212, 165, 116, 0.08), 0 0 80px rgba(110, 86, 207, 0.05), inset 0 0 30px rgba(212, 165, 116, 0.06)',
          border: '1px solid rgba(212, 165, 116, 0.1)',
        }}
      >
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute inset-3 rounded-full"
          style={{ background: 'radial-gradient(circle at 40% 40%, rgba(212, 165, 116, 0.15), transparent)' }}
        />
        {/* Inner ring */}
        <div className="absolute inset-4 rounded-full border border-oracle-gold/10" />
      </motion.div>

      {/* Eyebrow */}
      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="text-[11px] font-mono text-oracle-gold/60 tracking-[0.35em] uppercase mb-4"
      >
        Lenny's Podcast · 303 Episodes
      </motion.p>

      {/* Title — Cormorant Garamond, oversized */}
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-6xl md:text-8xl font-bold mb-5 text-center leading-[0.9] tracking-tight"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        <span className="text-gold-gradient">The Oracle</span>
      </motion.h1>

      {/* Subtitle — restrained */}
      <motion.p
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="text-base md:text-lg text-oracle-text-dim text-center max-w-md mb-3 leading-relaxed"
      >
        Product wisdom distilled into daily draws
      </motion.p>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        className="flex items-center gap-3 text-[11px] text-oracle-text-muted mb-12"
      >
        <span>50 Frameworks</span>
        <span className="w-1 h-1 rounded-full bg-oracle-gold/30" />
        <span>AI Answers</span>
        <span className="w-1 h-1 rounded-full bg-oracle-gold/30" />
        <span>PM DNA Profile</span>
      </motion.div>

      {/* Enter button — premium, minimal */}
      <motion.button
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onEnter}
        className="group relative px-8 py-4 rounded-xl cursor-pointer overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(212, 165, 116, 0.12), rgba(110, 86, 207, 0.08))',
          border: '1px solid rgba(212, 165, 116, 0.2)',
        }}
      >
        <span className="relative z-10 text-oracle-gold font-medium text-sm tracking-wide flex items-center gap-3">
          <span>Consult the Oracle</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-oracle-gold/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      </motion.button>

      {/* Footer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-8 text-[10px] text-oracle-text-muted/40 font-mono tracking-wider"
      >
        Built with wisdom from Lenny's Podcast
      </motion.p>
    </motion.div>
  )
}
