import { useEffect, useMemo, useRef, useState } from 'react'
import { animate, useInView } from 'framer-motion'
import { useIsMotionReady } from '@/lib/MotionReady'

/**
 * Counts from 0 up to the number embedded in `value` when scrolled into view.
 * Non-numeric suffixes and years are shown as-is. Always lands on the real
 * value even if the animation timeline is throttled.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ready = useIsMotionReady()
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })

  const { target, suffix, animatable } = useMemo(() => {
    const m = value.match(/^(\d+)(.*)$/)
    const n = m ? Number(m[1]) : 0
    return { target: n, suffix: m ? m[2] : '', animatable: !!m && n > 0 && n < 1900 }
  }, [value])

  const [display, setDisplay] = useState(() => (ready && animatable ? '0' : value))

  useEffect(() => {
    if (!ready || !animatable || !inView) {
      setDisplay(value)
      return
    }
    const controls = animate(0, target, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v) + suffix),
    })
    // land on the final value regardless of whether the tween actually ran
    const settle = window.setTimeout(() => setDisplay(value), 1800)
    return () => {
      controls.stop()
      window.clearTimeout(settle)
    }
  }, [ready, animatable, inView, target, suffix, value])

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  )
}
