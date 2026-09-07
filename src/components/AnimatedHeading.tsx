import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { easeOutExpo } from '@/lib/motion'
import { useIsMotionReady } from '@/lib/MotionReady'
import { useLang } from '@/i18n/LangProvider'

interface Props {
  text: string
  as?: 'h1' | 'h2' | 'h3'
  className?: string
  /** play on mount instead of on scroll-into-view */
  immediate?: boolean
  delay?: number
}

const container = (delay: number): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: delay } },
})
const wordV: Variants = {
  hidden: { y: '110%' },
  show: { y: 0, transition: { duration: 0.7, ease: easeOutExpo } },
}

/**
 * Word-by-word mask reveal. Translates `text` up front and opts the node out
 * of the DOM translator so it animates in both languages. Falls back to a
 * plain heading when motion isn't ready.
 */
export function AnimatedHeading({ text, as = 'h2', className, immediate = false, delay = 0 }: Props) {
  const ready = useIsMotionReady()
  const { t } = useLang()
  const resolved = t(text)

  if (!ready) {
    const Tag = as
    return (
      <Tag className={className} data-no-i18n="">
        {resolved}
      </Tag>
    )
  }

  const words = resolved.split(' ')
  const inner = words.map((w, i) => (
    <span
      key={i}
      className="inline-flex overflow-hidden pb-[0.14em] align-bottom"
      style={{ marginInlineEnd: i < words.length - 1 ? '0.25em' : 0 }}
    >
      <motion.span variants={wordV} data-reveal-word="" className="inline-block">
        {w}
      </motion.span>
    </span>
  ))

  const common = {
    className,
    'data-no-i18n': '',
    variants: container(delay),
    initial: 'hidden' as const,
    ...(immediate
      ? { animate: 'show' as const }
      : { whileInView: 'show' as const, viewport: { once: true, amount: 0.5 } }),
  }

  if (as === 'h1') return <motion.h1 {...common}>{inner}</motion.h1>
  if (as === 'h3') return <motion.h3 {...common}>{inner}</motion.h3>
  return <motion.h2 {...common}>{inner}</motion.h2>
}
