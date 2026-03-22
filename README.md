# 🔮 Lenny's Oracle

**Product management wisdom from 303 episodes of Lenny's Podcast, distilled into daily draws.**

A mystical PM wisdom app that combines tarot-style card draws, an AI-powered oracle, and a PM DNA profiler — all built from real podcast content.

## ✨ Features

### 🃏 Daily Card Draw
- 3 face-down cards revealed with smooth flip animations
- Each card contains a PM framework, key quote, and guest attribution  
- 50 frameworks extracted from 303 episodes
- New cards each day (seeded by date)
- Particle constellation background

### 🔮 AI Oracle
- Ask any product management question
- Powered by Gemini 2.0 Flash with RAG from all 303 transcripts
- Answers cite specific guests and episodes
- Demo mode works without API key

### 🧬 PM DNA Profile
- Tracks which PM domains you explore (Growth, Strategy, Design, Leadership, Data, Culture)
- Beautiful SVG radar chart visualization
- Assigns a PM archetype based on your exploration patterns
- Shareable text summary

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Enable AI Oracle (optional)

1. Get a free API key from [Google AI Studio](https://ai.google.dev/)
2. Create `.env` file:
   ```
   VITE_GEMINI_API_KEY=your_key_here
   ```
3. Restart dev server

The app works fully without an API key (demo responses for the Oracle).

## 🎨 Design

- **Theme:** Mystical cosmic (deep purple/blue gradients, gold accents)
- **Typography:** Playfair Display (serif) + Inter (sans)
- **Animations:** Framer Motion card flips, particle effects
- **Mobile-first:** Touch-friendly, responsive layout

## 🛠 Tech Stack

- **Frontend:** React + Vite + Tailwind CSS v4
- **Animations:** Framer Motion + tsParticles
- **AI:** Google Gemini 2.0 Flash
- **Charts:** Custom SVG radar chart
- **Icons:** Lucide React
- **Data:** 303 Lenny's Podcast transcripts → 50 PM framework cards

## 📊 Data Pipeline

The `scripts/process-transcripts.js` script:
1. Reads 303 podcast transcript files
2. Extracts YAML frontmatter (guest, title, YouTube URL)
3. Matches 50 curated PM frameworks to their most relevant episodes
4. Extracts representative quotes (filtering ad reads)
5. Outputs `cards.json` and `episodes.json` for the app

## 📁 Project Structure

```
src/
├── components/
│   ├── Landing.jsx        # Welcome screen with mystical orb
│   ├── Navigation.jsx     # Top nav bar
│   ├── DailyDraw.jsx      # 3-card daily draw with flip animation
│   ├── Oracle.jsx         # AI chat interface
│   ├── PmDna.jsx          # Radar chart + PM archetype
│   └── ParticleBackground.jsx  # tsParticles constellation
├── utils/
│   └── gemini.js          # Gemini AI integration + demo responses
├── data/
│   ├── cards.json         # 50 PM framework cards
│   ├── episodes.json      # 303 episode index
│   └── stats.json         # Processing stats
├── App.jsx
├── main.jsx
└── index.css
```

## 🏆 Built for Lenny's Newsletter Competition

This project was created as a submission for Lenny's Newsletter building competition, demonstrating how 303 episodes of product wisdom can be made interactive and delightful.

---

*Built with ❤️ and lots of podcast listening*
