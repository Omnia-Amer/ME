import { useEffect, useLayoutEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { useLang } from './LangProvider'
import { norm, SUPPLEMENT_AR } from './dict'

const originalText = new WeakMap<Text, string>()
const originalAttr = new WeakMap<Element, Record<string, string>>()

function buildDict(): Record<string, string> {
  return {
    ...(typeof window !== 'undefined' && window.I18N_AR ? window.I18N_AR : {}),
    ...SUPPLEMENT_AR,
  }
}

function translateAttrs(root: HTMLElement, toAr: boolean, dict: Record<string, string>) {
  root.querySelectorAll<HTMLElement>('[placeholder], [aria-label]').forEach((el) => {
    if (el.closest('[data-no-i18n]')) return
    let saved = originalAttr.get(el)
    if (!saved) {
      saved = {}
      for (const a of ['placeholder', 'aria-label']) {
        const v = el.getAttribute(a)
        if (v != null) saved[a] = v
      }
      originalAttr.set(el, saved)
    }
    for (const [a, orig] of Object.entries(saved)) {
      const target = toAr ? (dict[norm(orig)] ?? orig) : orig
      if (el.getAttribute(a) !== target) el.setAttribute(a, target)
    }
  })
}

function translateTree(root: HTMLElement, toAr: boolean, dict: Record<string, string>) {
  translateAttrs(root, toAr, dict)
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const p = node.parentElement
      if (!p) return NodeFilter.FILTER_REJECT
      const tag = p.tagName
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'TEXTAREA') return NodeFilter.FILTER_REJECT
      if (p.closest('[data-no-i18n]')) return NodeFilter.FILTER_REJECT
      if (!node.nodeValue || !/\S/.test(node.nodeValue)) return NodeFilter.FILTER_REJECT
      return NodeFilter.FILTER_ACCEPT
    },
  })
  let node: Node | null
  while ((node = walker.nextNode())) {
    const text = node as Text
    if (!originalText.has(text)) originalText.set(text, text.nodeValue ?? '')
    const original = originalText.get(text)!
    const target = toAr ? (dict[norm(original)] ?? original) : original
    if (text.nodeValue !== target) text.nodeValue = target
  }
}

/**
 * Mirrors the legacy site's in-place text translation: any English string
 * already keyed in /i18n-ar.js (plus the v2 supplement) is swapped when
 * Arabic is active. A MutationObserver keeps lazily-mounted routes and
 * re-renders translated without a flash.
 */
export function Localize({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const { lang, ready } = useLang()
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    const dict = buildDict()
    const run = () => translateTree(root, lang === 'ar', dict)
    run()
    // catch route content that mounts a tick later (lazy routes / Suspense)
    const raf = requestAnimationFrame(run)
    const t1 = window.setTimeout(run, 80)
    const t2 = window.setTimeout(run, 300)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [lang, ready, pathname])

  useEffect(() => {
    const root = ref.current
    if (!root || !ready) return
    let raf = 0
    const obs = new MutationObserver(() => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => translateTree(root, lang === 'ar', buildDict()))
    })
    obs.observe(root, { childList: true, subtree: true, characterData: true })
    return () => {
      obs.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [lang, ready])

  return <div ref={ref}>{children}</div>
}
