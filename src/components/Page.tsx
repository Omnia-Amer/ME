import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { pageTransition } from '@/lib/motion'
import { useIsMotionReady } from '@/lib/MotionReady'

/** Route-level shell: enter/exit transition + scroll reset + heading focus. */
export function Page({ children, title }: { children: ReactNode; title?: string }) {
  const ref = useRef<HTMLElement>(null)
  const ready = useIsMotionReady()

  useEffect(() => {
    window.scrollTo(0, 0)
    if (title) document.title = `${title} — Omnia Amer`
    const h = ref.current?.querySelector<HTMLElement>('h1, h2')
    h?.setAttribute('tabindex', '-1')
    h?.focus({ preventScroll: true })
  }, [title])

  if (!ready)
    return (
      <main ref={ref} id="main-content" className="pt-28">
        {children}
      </main>
    )

  return (
    <motion.main
      ref={ref}
      id="main-content"
      variants={pageTransition}
      initial="pageHidden"
      animate="pageShow"
      exit="pageExit"
      className="pt-28"
    >
      {children}
    </motion.main>
  )
}
