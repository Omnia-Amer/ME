import { useEffect, useState } from 'react'

/**
 * True only when the browser's animation timeline is actually advancing and the
 * user hasn't asked for reduced motion. When false, components should render in
 * their final visible state with no entrance animation — this keeps the page
 * correct for reduced-motion users, crawlers, and non-painting environments.
 */
export function useMotionReady(): boolean {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    // Escape hatch: ?static or localStorage flag forces plain, fully-visible render
    try {
      if (new URLSearchParams(location.search).has('static') || localStorage.getItem('omnia_static')) return
    } catch {
      /* ignore */
    }
    let raf1 = 0
    let raf2 = 0
    const t0 = document.timeline.currentTime ?? 0
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const t1 = document.timeline.currentTime ?? 0
        if (t1 > t0) setReady(true)
      })
    })
    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
    }
  }, [])

  return ready
}
