import { motion } from 'framer-motion'

/** Animated four-point sparkle — the brand mark, carried over from v1. */
export function Mark({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      initial={{ rotate: 0, scale: 1 }}
      animate={{ scale: [1, 1.08, 1] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      whileHover={{ rotate: 180, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } }}
    >
      <path
        d="M12 1 Q13.2 10.8 23 12 Q13.2 13.2 12 23 Q10.8 13.2 1 12 Q10.8 10.8 12 1 Z"
        fill="var(--color-accent)"
      />
    </motion.svg>
  )
}
