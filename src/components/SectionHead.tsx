import type { ReactNode } from 'react'
import { Reveal } from './Reveal'
import { Eyebrow } from './Eyebrow'
import { AnimatedHeading } from './AnimatedHeading'

interface Props {
  eyebrow?: string
  title: string
  body?: string
  children?: ReactNode
  align?: 'start' | 'center'
}

export function SectionHead({ eyebrow, title, body, children, align = 'start' }: Props) {
  return (
    <Reveal className={`mb-12 max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <AnimatedHeading as="h2" text={title} className="mt-4 text-[clamp(2.1rem,5vw,3.4rem)] leading-[1.05]" />
      {body && <p className="mt-4 max-w-xl text-[1.03rem] text-ink-soft">{body}</p>}
      {children && (
        <div className={`mt-6 flex flex-wrap gap-4 ${align === 'center' ? 'justify-center' : ''}`}>{children}</div>
      )}
    </Reveal>
  )
}
