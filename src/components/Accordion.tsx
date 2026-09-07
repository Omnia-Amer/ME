import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Reveal } from './Reveal'

export interface AccItem {
  num?: string
  title: string
  body: string
}

export function Accordion({ items, startOpen = 0 }: { items: readonly AccItem[]; startOpen?: number }) {
  const [open, setOpen] = useState<number | null>(startOpen)

  return (
    <div className="flex flex-col gap-4">
      {items.map((it, i) => {
        const isOpen = open === i
        return (
          <Reveal key={i} as="div">
            <div className="overflow-hidden rounded-md border border-line bg-surface">
              <button
                className="flex w-full items-center gap-4 px-6 py-5 text-start"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                {it.num && <span className="w-8 shrink-0 font-mono text-[13px] text-ink-faint u-ltr">{it.num}</span>}
                <h3 className="flex-1 text-[1.15rem] font-normal">{it.title}</h3>
                <span
                  className={`grid size-8 shrink-0 place-items-center rounded-full border border-line-strong transition-transform duration-300 ${isOpen ? 'rotate-45 text-accent' : 'text-ink-faint'}`}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <p className="max-w-2xl px-6 pb-6 ps-[4.5rem] text-[15px] leading-relaxed text-ink-soft max-[640px]:ps-6">
                      {it.body}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        )
      })}
    </div>
  )
}
