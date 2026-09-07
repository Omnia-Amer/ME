import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLang } from '@/i18n/LangProvider'

const STR = {
  en: { close: 'Close', prev: 'Previous image', next: 'Next image' },
  ar: { close: 'إغلاق', prev: 'الصورة السابقة', next: 'الصورة التالية' },
}

/**
 * Attaches a screenshot zoom viewer to every `.cd-shot img` inside `containerRef`.
 * Ported from the legacy site: prev/next within the case, Esc / backdrop to close.
 */
export function Lightbox({
  containerRef,
  active,
}: {
  containerRef: React.RefObject<HTMLElement | null>
  active: unknown
}) {
  const { lang } = useLang()
  const s = STR[lang === 'ar' ? 'ar' : 'en']
  const [group, setGroup] = useState<HTMLImageElement[]>([])
  const [idx, setIdx] = useState<number | null>(null)
  const lastFocus = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const root = containerRef.current
    if (!root) return
    const imgs = Array.from(root.querySelectorAll<HTMLImageElement>('.cd-shot img'))
    const onClick = (e: Event) => {
      const target = e.currentTarget as HTMLImageElement
      lastFocus.current = target
      setGroup(imgs)
      setIdx(imgs.indexOf(target))
    }
    imgs.forEach((img) => {
      img.setAttribute('role', 'button')
      img.setAttribute('tabindex', '0')
      img.addEventListener('click', onClick)
      img.addEventListener('keydown', (e) => {
        if ((e as KeyboardEvent).key === 'Enter' || (e as KeyboardEvent).key === ' ') {
          e.preventDefault()
          onClick({ currentTarget: img } as unknown as Event)
        }
      })
    })
    return () => imgs.forEach((img) => img.removeEventListener('click', onClick))
  }, [containerRef, active])

  const close = useCallback(() => {
    setIdx(null)
    if (lastFocus.current && document.contains(lastFocus.current)) lastFocus.current.focus()
  }, [])
  const step = useCallback(
    (d: number) => setIdx((i) => (i == null ? i : Math.min(Math.max(i + d, 0), group.length - 1))),
    [group.length],
  )

  useEffect(() => {
    if (idx == null) return
    const rtl = lang === 'ar'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') step(rtl ? -1 : 1)
      else if (e.key === 'ArrowLeft') step(rtl ? 1 : -1)
    }
    document.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [idx, lang, close, step])

  const cur = idx != null ? group[idx] : null

  return (
    <AnimatePresence>
      {cur && (
        <motion.div
          className="lbx"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          onClick={(e) => {
            if (e.target === e.currentTarget) close()
          }}
        >
          <div className="lbx-bar">
            <span className="u-ltr" style={{ minWidth: 64 }}>
              {(idx ?? 0) + 1} / {group.length}
            </span>
            <span className="lbx-spacer" />
            <button className="lbx-btn" onClick={() => step(-1)} disabled={idx === 0} aria-label={s.prev}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            <button className="lbx-btn" onClick={() => step(1)} disabled={idx === group.length - 1} aria-label={s.next}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
            <button className="lbx-btn" onClick={close} aria-label={s.close}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          <div
            className="lbx-stage"
            onClick={(e) => {
              if (e.target === e.currentTarget) close()
            }}
          >
            <img src={cur.currentSrc || cur.src} alt={cur.alt} />
          </div>
          <p className="lbx-cap">{cur.alt}</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
