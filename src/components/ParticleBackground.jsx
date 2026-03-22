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
      color: { value: ['#ffd700', '#7c3aed', '#a855f7', '#ffffff'] },
      links: {
        color: '#ffd700',
        distance: 150,
        enable: true,
        opacity: 0.08,
        width: 0.5,
      },
      move: {
        enable: true,
        speed: 0.3,
        direction: 'none',
        random: true,
        straight: false,
        outModes: { default: 'out' },
      },
      number: {
        density: { enable: true, area: 1200 },
        value: 60,
      },
      opacity: {
        value: { min: 0.1, max: 0.5 },
        animation: { enable: true, speed: 0.5, minimumValue: 0.05 },
      },
      shape: { type: 'circle' },
      size: {
        value: { min: 0.5, max: 2 },
        animation: { enable: true, speed: 1, minimumValue: 0.3 },
      },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: 'grab' },
      },
      modes: {
        grab: { distance: 140, links: { opacity: 0.2 } },
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
