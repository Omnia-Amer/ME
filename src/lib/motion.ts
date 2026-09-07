import type { Variants, Transition } from 'framer-motion'

export const easeOutExpo: Transition['ease'] = [0.16, 1, 0.3, 1]

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOutExpo },
  },
}

export const stagger = (gap = 0.08, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
})

export const pageTransition: Variants = {
  pageHidden: { opacity: 0, y: 14 },
  pageShow: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOutExpo } },
  pageExit: { opacity: 0, y: -10, transition: { duration: 0.25, ease: 'easeIn' } },
}
