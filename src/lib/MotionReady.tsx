import { createContext, useContext, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useMotionReady } from './useMotionReady'

const Ctx = createContext(false)

export function MotionReadyProvider({ children }: { children: ReactNode }) {
  const ready = useMotionReady()

  // Failsafe: if the animation timeline is throttled (offscreen tab, some
  // preview renderers), entrance tweens never finish — force [data-reveal]
  // elements visible. Only engages when the timeline has genuinely stalled,
  // so it never interferes with real playback.
  useEffect(() => {
    const startWall = performance.now()
    const startTl = Number(document.timeline.currentTime ?? 0)
    const id = window.setTimeout(() => {
      const wall = performance.now() - startWall
      const tl = Number(document.timeline.currentTime ?? 0) - startTl
      if (tl < wall * 0.4) document.documentElement.setAttribute('data-reveal-failsafe', '')
    }, 2200)
    return () => window.clearTimeout(id)
  }, [])

  return <Ctx.Provider value={ready}>{children}</Ctx.Provider>
}

/** True when entrance animations are safe to run (timeline advancing, motion allowed). */
export const useIsMotionReady = () => useContext(Ctx)
