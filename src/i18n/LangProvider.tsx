import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { asset } from '@/lib/paths'
import { norm, SUPPLEMENT_AR } from './dict'

type Lang = 'en' | 'ar'

interface LangCtx {
  lang: Lang
  dir: 'ltr' | 'rtl'
  ready: boolean
  toggle: () => void
  setLang: (l: Lang) => void
  /** Translate a known English string to Arabic (falls back to the input). */
  t: (en: string) => string
}

const Ctx = createContext<LangCtx | null>(null)

declare global {
  interface Window {
    I18N_AR?: Record<string, string>
  }
}

let dictPromise: Promise<Record<string, string>> | null = null
function loadLegacyDict(): Promise<Record<string, string>> {
  if (window.I18N_AR) return Promise.resolve(window.I18N_AR)
  if (dictPromise) return dictPromise
  dictPromise = new Promise((resolve) => {
    const s = document.createElement('script')
    s.src = asset('i18n-ar.js')
    s.onload = s.onerror = () => resolve(window.I18N_AR ?? {})
    document.head.appendChild(s)
  })
  return dictPromise
}

function initialLang(): Lang {
  try {
    const qp = new URLSearchParams(location.search).get('lang')
    if (qp === 'ar' || qp === 'en') return qp
    const saved = localStorage.getItem('omnia_lang')
    if (saved === 'ar' || saved === 'en') return saved
  } catch {
    /* ignore */
  }
  return 'en'
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)
  const [dict, setDict] = useState<Record<string, string>>({})
  const [ready, setReady] = useState(lang === 'en')

  useEffect(() => {
    const dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.setAttribute('lang', lang)
    document.documentElement.setAttribute('dir', dir)
    try {
      localStorage.setItem('omnia_lang', lang)
      const u = new URL(location.href)
      if (lang === 'ar') u.searchParams.set('lang', 'ar')
      else u.searchParams.delete('lang')
      history.replaceState(null, '', u.pathname + u.search + u.hash)
    } catch {
      /* ignore */
    }
    if (lang === 'ar' && !Object.keys(dict).length) {
      setReady(false)
      loadLegacyDict().then((d) => {
        setDict({ ...d, ...SUPPLEMENT_AR })
        setReady(true)
      })
    } else {
      setReady(true)
    }
  }, [lang, dict])

  const setLang = useCallback((l: Lang) => setLangState(l), [])
  const toggle = useCallback(() => setLangState((l) => (l === 'ar' ? 'en' : 'ar')), [])

  const t = useCallback(
    (en: string) => {
      if (lang === 'en') return en
      return dict[norm(en)] ?? SUPPLEMENT_AR[norm(en)] ?? en
    },
    [lang, dict],
  )

  const value = useMemo<LangCtx>(
    () => ({ lang, dir: lang === 'ar' ? 'rtl' : 'ltr', ready, toggle, setLang, t }),
    [lang, ready, toggle, setLang, t],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useLang(): LangCtx {
  const c = useContext(Ctx)
  if (!c) throw new Error('useLang must be used within LangProvider')
  return c
}

/** The merged EN->AR dictionary, for the DOM-walk translator. */
export function useDict(): Record<string, string> {
  return (typeof window !== 'undefined' && window.I18N_AR ? { ...window.I18N_AR, ...SUPPLEMENT_AR } : SUPPLEMENT_AR)
}
