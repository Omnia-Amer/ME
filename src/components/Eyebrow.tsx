import type { ReactNode } from 'react'

export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 font-mono text-[11.5px] uppercase tracking-[0.1em] text-ink-soft ${className}`}
    >
      <span className="size-1.5 rounded-full bg-accent" />
      {children}
    </span>
  )
}
