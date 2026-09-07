import { useEffect } from 'react'
import { useIsMotionReady } from '@/lib/MotionReady'

/**
 * Progressive scroll-reveal for the direct children of a container whose
 * markup is injected via dangerouslySetInnerHTML (the case-study body).
 * No-op — and fully visible — when motion isn't ready.
 */
export function useRevealChildren(ref: React.RefObject<HTMLElement | null>, deps: readonly unknown[] = []) {
  const ready = useIsMotionReady()
  useEffect(() => {
    const root = ref.current
    if (!root || !ready) return
    root.classList.add('cb-anim')
    const kids = Array.from(root.children) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('cb-in')
            io.unobserve(e.target)
          }
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -6% 0px' },
    )
    kids.forEach((k) => io.observe(k))
    return () => {
      io.disconnect()
      root.classList.remove('cb-anim')
      kids.forEach((k) => k.classList.remove('cb-in'))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, ref, ...deps])
}
