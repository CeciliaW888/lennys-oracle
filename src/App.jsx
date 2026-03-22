import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import ParticleBackground from './components/ParticleBackground'
import Navigation from './components/Navigation'
import DailyDraw from './components/DailyDraw'
import Oracle from './components/Oracle'
import PmDna from './components/PmDna'
import Landing from './components/Landing'

function App() {
  const [currentView, setCurrentView] = useState('landing')
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('lennys-oracle-profile')
    return saved ? JSON.parse(saved) : {
      draws: [],
      explorationHistory: { Growth: 0, Strategy: 0, Design: 0, Leadership: 0, Data: 0, Culture: 0 },
      questionsAsked: 0,
      firstVisit: new Date().toISOString(),
    }
  })

  useEffect(() => {
    localStorage.setItem('lennys-oracle-profile', JSON.stringify(userProfile))
  }, [userProfile])

  const trackExploration = (category) => {
    setUserProfile(prev => ({
      ...prev,
      explorationHistory: {
        ...prev.explorationHistory,
        [category]: (prev.explorationHistory[category] || 0) + 1,
      }
    }))
  }

  const saveDraw = (cards) => {
    const today = new Date().toISOString().split('T')[0]
    setUserProfile(prev => ({
      ...prev,
      draws: [...prev.draws.filter(d => d.date !== today), { date: today, cards: cards.map(c => c.id) }],
    }))
  }

  const trackQuestion = () => {
    setUserProfile(prev => ({ ...prev, questionsAsked: prev.questionsAsked + 1 }))
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <ParticleBackground />
      
      {currentView !== 'landing' && (
        <Navigation currentView={currentView} setCurrentView={setCurrentView} />
      )}

      <AnimatePresence mode="wait">
        {currentView === 'landing' && (
          <Landing key="landing" onEnter={() => setCurrentView('draw')} />
        )}
        {currentView === 'draw' && (
          <DailyDraw 
            key="draw" 
            userProfile={userProfile} 
            onSaveDraw={saveDraw}
            onTrackExploration={trackExploration}
          />
        )}
        {currentView === 'oracle' && (
          <Oracle 
            key="oracle" 
            onTrackExploration={trackExploration}
            onTrackQuestion={trackQuestion}
          />
        )}
        {currentView === 'dna' && (
          <PmDna 
            key="dna" 
            userProfile={userProfile} 
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
