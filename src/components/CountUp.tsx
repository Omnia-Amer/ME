import { useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'framer-motion'
import { useIsMotionReady } from '@/lib/MotionReady'

/**
 * Counts from 0 up to the number embedded in `value` when scrolled into view.
 * Non-numeric parts (e.g. "+", a year) are preserved / shown as-is.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ready = useIsMotionReady()
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const match = value.match(/^(\d+)(.*)$/)
  const target = match ? Number(match[1]) : 0
  const suffix = match ? match[2] : ''
  const isYear = target >= 1900
  const [display, setDisplay] = useState(ready && match && !isYear ? '0' : value)

  useEffect(() => {
    if (!ready || !match || isYear || !inView) {
      setDisplay(value)
      return
    }
    const controls = animate(0, target, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v) + suffix),
    })
    const failsafe = window.setTimeout(() => setDisplay(value), 2000)
    return () => {
      controls.stop()
      window.clearTimeout(failsafe)
    }
  }, [ready, inView, match, isYear, target, suffix, value])

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  )
}
