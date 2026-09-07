import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { useMotionReady } from './useMotionReady'

const Ctx = createContext(false)

export function MotionReadyProvider({ children }: { children: ReactNode }) {
  const ready = useMotionReady()
  return <Ctx.Provider value={ready}>{children}</Ctx.Provider>
}

/** True when entrance animations are safe to run (timeline advancing, motion allowed). */
export const useIsMotionReady = () => useContext(Ctx)
