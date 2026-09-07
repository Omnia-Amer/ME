import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Mark } from './Mark'
import { footer } from '@/content/site.generated'
import { hrefToPath, isExternal, asset } from '@/lib/paths'

const SOCIAL_ICON: Record<string, ReactNode> = {
  LinkedIn: <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.11 20.45H3.56V9h3.55v11.45z" />,
  Behance: <path d="M7.8 10.5c1 0 1.7-.55 1.7-1.5S8.8 7.6 7.8 7.6H4.5v2.9h3.3zm.3 6.3c1.2 0 2-.6 2-1.7s-.8-1.7-2-1.7H4.5v3.4h3.6zM2.2 5.4h5.9c1.4 0 2.5.3 3.3.9.8.6 1.2 1.5 1.2 2.6 0 .7-.2 1.3-.5 1.8-.3.5-.8.9-1.4 1.2.8.2 1.4.6 1.8 1.2.4.6.6 1.3.6 2.1 0 1.2-.4 2.2-1.3 2.9-.9.7-2.1 1.1-3.6 1.1H2.2V5.4zm12.1 1.5h6v1.4h-6V6.9zm2.9 3.1c1.6 0 2.9.5 3.8 1.4.9.9 1.3 2.2 1.3 3.7v.6h-7.4c.1.9.4 1.6.9 2.1.5.5 1.2.7 2 .7.6 0 1.1-.1 1.6-.4.4-.3.7-.6.9-1.1h2c-.3 1-.9 1.9-1.8 2.5-.9.6-1.9.9-3.1.9-1.6 0-2.9-.5-3.9-1.6-1-1.1-1.5-2.4-1.5-4.1 0-1.6.5-3 1.5-4.1 1-1.1 2.3-1.6 3.9-1.6z" />,
  Dribbble: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M4 9.5c4.5 1.6 9 2 15 .6M4.7 16.8c2-3.5 5-6 9.6-7.4 1.7-.5 3.5-.7 5.4-.6M9 3.4c3 3.5 4.8 7.5 5.4 12.6.3 2 .3 3.3.2 4.5" />
    </>
  ),
}

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-line bg-bg py-20">
      <div className="u-wrap">
        <div className="grid gap-12 pb-14 md:grid-cols-[1.3fr_.9fr_.9fr_.9fr]">
          <div>
            <Link to="/" className="mb-4 flex items-center gap-2 font-display text-[19px]">
              <Mark />
              <span className="u-ltr">
                <b className="font-medium">Omnia</b>
                <span className="font-light text-ink-faint">&nbsp;Amer</span>
              </span>
            </Link>
            <p className="mb-6 max-w-[280px] text-[14.5px] leading-relaxed text-ink-soft">{footer.tagline}</p>
            <div className="flex gap-2">
              {footer.social.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="grid size-9 place-items-center rounded-full border border-line-strong text-ink-soft transition-colors hover:border-accent hover:text-ink"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill={s.label === 'Dribbble' ? 'none' : 'currentColor'}
                    stroke={s.label === 'Dribbble' ? 'currentColor' : 'none'}
                    strokeWidth={1.5}
                  >
                    {SOCIAL_ICON[s.label]}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {footer.columns.map((col) => (
            <div key={col.title}>
              <div className="mb-4 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-faint">{col.title}</div>
              {col.links.map((l) => {
                if (l.download)
                  return (
                    <a
                      key={l.label}
                      href={asset('assets/Omnia_Amer_CV_2026.pdf')}
                      download
                      className="block py-1.5 text-[14px] text-ink-soft transition-colors hover:text-ink"
                    >
                      {l.label}
                    </a>
                  )
                if (isExternal(l.href))
                  return (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block py-1.5 text-[14px] text-ink-soft transition-colors hover:text-ink"
                    >
                      {l.label}
                    </a>
                  )
                return (
                  <Link
                    key={l.label}
                    to={hrefToPath(l.href)}
                    className="block py-1.5 text-[14px] text-ink-soft transition-colors hover:text-ink"
                  >
                    {l.label}
                  </Link>
                )
              })}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8 font-mono text-[11.5px] text-ink-faint">
          <div>{footer.copy}</div>
          <div>{footer.madeby}</div>
        </div>
      </div>
    </footer>
  )
}
