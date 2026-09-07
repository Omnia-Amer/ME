import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Mark } from './Mark'
import { Button } from './Button'
import { useLang } from '@/i18n/LangProvider'
import { useTheme } from '@/lib/useTheme'

const NAV = [
  { to: '/work', label: 'Work' },
  { to: '/about', label: 'About' },
  { to: '/process', label: 'Process' },
  { to: '/skills', label: 'Skills' },
  { to: '/contact', label: 'Contact' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { t, lang, toggle: toggleLang } = useLang()
  const { theme, toggle: toggleTheme } = useTheme()
  const loc = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [loc.pathname])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-line bg-bg/72 py-3.5 backdrop-blur-xl'
          : 'border-b border-transparent py-6'
      }`}
    >
      <div className="u-wrap flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2 font-display text-[19px]" aria-label="Omnia Amer — home">
          <Mark />
          <span className="u-ltr">
            <b className="font-medium">Omnia</b>
            <span className="font-light text-ink-faint">&nbsp;Amer</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => {
            const active = loc.pathname === n.to || loc.pathname.startsWith(n.to + '/')
            return (
              <NavLink
                key={n.to}
                to={n.to}
                className={`relative rounded-full px-4 py-2 font-mono text-[12.5px] tracking-[0.03em] transition-colors ${
                  active ? 'text-ink' : 'text-ink-soft hover:text-ink'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="navpill"
                    className="absolute inset-0 -z-10 rounded-full bg-ink/10"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                {n.label}
              </NavLink>
            )
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          <div className="hidden sm:block">
            <Button to="/contact" variant="solid" small>
              Let&apos;s Talk
            </Button>
          </div>
          <button
            onClick={toggleTheme}
            aria-label={t(theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme')}
            className="grid size-9 place-items-center rounded-full border border-line-strong text-ink-soft transition-colors hover:border-accent hover:text-ink"
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            onClick={toggleLang}
            aria-label={t('Switch language')}
            className="rounded-full border border-line-strong px-3 py-1.5 font-mono text-[12px] text-ink-soft transition-colors hover:border-accent hover:text-ink"
          >
            {lang === 'ar' ? 'EN' : 'عربي'}
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="grid size-10 place-items-center rounded-full border border-line-strong text-ink md:hidden"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="u-wrap mt-3 flex flex-col gap-1 md:hidden"
          >
            <div className="overflow-hidden rounded-md border border-line bg-surface/95 p-2 backdrop-blur-xl">
              {NAV.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  className={({ isActive }) =>
                    `block rounded-md px-4 py-3.5 font-mono text-[13px] ${isActive ? 'text-ink' : 'text-ink-soft'}`
                  }
                >
                  {n.label}
                </NavLink>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
)
const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
  </svg>
)
