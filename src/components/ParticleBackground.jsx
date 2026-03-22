import { useCallback, useMemo } from 'react'
import Particles from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

export default function ParticleBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine)
  }, [])

  const options = useMemo(() => ({
    fullScreen: { enable: false },
    background: { color: { value: 'transparent' } },
    fpsLimit: 60,
    particles: {
      color: { value: ['#d4a574', '#6e56cf', '#3e63dd'] },
      links: {
        color: '#d4a574',
        distance: 180,
        enable: true,
        opacity: 0.04,
        width: 0.5,
      },
      move: {
        enable: true,
        speed: 0.2,
        direction: 'none',
        random: true,
        straight: false,
        outModes: { default: 'out' },
      },
      number: {
        density: { enable: true, area: 1500 },
        value: 40,
      },
      opacity: {
        value: { min: 0.05, max: 0.3 },
        animation: { enable: true, speed: 0.3, minimumValue: 0.03 },
      },
      shape: { type: 'circle' },
      size: {
        value: { min: 0.3, max: 1.5 },
        animation: { enable: true, speed: 0.5, minimumValue: 0.2 },
      },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: 'grab' },
      },
      modes: {
        grab: { distance: 120, links: { opacity: 0.1 } },
      },
    },
    detectRetina: true,
  }), [])

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={options}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
    />
  )
}
