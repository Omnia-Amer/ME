import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { easeOutExpo } from '@/lib/motion'
import { useIsMotionReady } from '@/lib/MotionReady'

interface Props {
  children: ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'section' | 'li' | 'article'
}

/** Scroll-into-view fade+rise. Renders plain (visible) when motion isn't ready. */
export function Reveal({ children, className, delay = 0, as = 'div' }: Props) {
  const ready = useIsMotionReady()
  const Tag = as
  if (!ready) return <Tag className={className}>{children}</Tag>

  const M = motion[as]
  return (
    <M
      className={className}
      data-reveal=""
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: easeOutExpo, delay }}
    >
      {children}
    </M>
  )
}
