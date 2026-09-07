import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { isExternal } from '@/lib/paths'
import { useIsMotionReady } from '@/lib/MotionReady'

type Variant = 'solid' | 'ghost'
interface BaseProps {
  children: ReactNode
  variant?: Variant
  small?: boolean
  className?: string
  full?: boolean
}
type Props = BaseProps &
  (
    | { to: string; href?: never; onClick?: never }
    | { href: string; to?: never; download?: boolean; onClick?: never }
    | { to?: never; href?: never; onClick?: () => void; type?: 'button' | 'submit'; download?: never }
  )

const base =
  'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-mono tracking-wide whitespace-nowrap transition-[border-color,background-color,color] duration-200 ease-out-expo cursor-pointer disabled:opacity-55 disabled:pointer-events-none'

function classesFor(v: Variant, small?: boolean, full?: boolean) {
  const size = small ? 'px-4 py-2 text-[12px]' : 'px-6 py-4 text-[13px]'
  const skin =
    v === 'solid'
      ? 'bg-ink text-bg border border-ink hover:bg-accent hover:border-accent hover:text-accent-ink'
      : 'border border-line-strong text-ink hover:border-accent'
  return [base, size, skin, full ? 'w-full' : ''].join(' ')
}

export function Button(props: Props) {
  const { children, variant = 'ghost', small, className = '', full } = props
  const ready = useIsMotionReady()
  const ref = useRef<HTMLElement>(null)
  const cls = `${classesFor(variant, small, full)} ${className}`

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 250, damping: 18, mass: 0.3 })
  const y = useSpring(my, { stiffness: 250, damping: 18, mass: 0.3 })

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
    if (ready) {
      mx.set((e.clientX - (r.left + r.width / 2)) * 0.22)
      my.set((e.clientY - (r.top + r.height / 2)) * 0.22)
    }
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  const inner = (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(140px circle at var(--mx,50%) var(--my,50%), color-mix(in srgb, var(--color-accent) 32%, transparent), transparent 70%)',
        }}
      />
      <span className="relative inline-flex items-center gap-2">{children}</span>
    </>
  )

  const style = ready ? { x, y } : undefined
  const handlers = { onMouseMove: onMove, onMouseLeave: onLeave }

  if ('to' in props && props.to) {
    return (
      <motion.div style={style} className={full ? 'block w-full' : 'inline-block'}>
        <Link ref={ref as React.Ref<HTMLAnchorElement>} to={props.to} className={cls} {...handlers}>
          {inner}
        </Link>
      </motion.div>
    )
  }
  if ('href' in props && props.href) {
    const ext = isExternal(props.href)
    return (
      <motion.div style={style} className={full ? 'block w-full' : 'inline-block'}>
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={props.href}
          className={cls}
          {...handlers}
          download={'download' in props ? props.download : undefined}
          {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {inner}
        </a>
      </motion.div>
    )
  }
  const btn = props as { type?: 'button' | 'submit'; onClick?: () => void }
  return (
    <motion.div style={style} className="inline-block">
      <button ref={ref as React.Ref<HTMLButtonElement>} type={btn.type ?? 'button'} className={cls} {...handlers} onClick={btn.onClick}>
        {inner}
      </button>
    </motion.div>
  )
}

export function ArrowUpRight({ size = 13 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
      className="transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
    >
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  )
}
