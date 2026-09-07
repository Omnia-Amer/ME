import { useEffect, useLayoutEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { useLang } from './LangProvider'
import { norm, SUPPLEMENT_AR } from './dict'

const originalText = new WeakMap<Text, string>()

function buildDict(): Record<string, string> {
  return {
    ...(typeof window !== 'undefined' && window.I18N_AR ? window.I18N_AR : {}),
    ...SUPPLEMENT_AR,
  }
}

function translateTree(root: HTMLElement, toAr: boolean, dict: Record<string, string>) {
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
    if (!toAr) {
      if (text.nodeValue !== original) text.nodeValue = original
      continue
    }
    const hit = dict[norm(original)]
    const target = hit ?? original
    if (text.nodeValue !== target) text.nodeValue = target
  }
}

/**
 * Wraps the app and mirrors the legacy site's text-node translation:
 * every English string already keyed in /i18n-ar.js is swapped in place
 * when Arabic is active. A MutationObserver keeps route changes and
 * re-renders translated without a flash.
 */
export function Localize({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const { lang, ready } = useLang()
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    const root = ref.current
    if (!root) return
    translateTree(root, lang === 'ar', buildDict())
  }, [lang, ready, pathname])

  useEffect(() => {
    const root = ref.current
    if (!root || lang !== 'ar' || !ready) return
    const dict = buildDict()
    let raf = 0
    const obs = new MutationObserver(() => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => translateTree(root, true, dict))
    })
    obs.observe(root, { childList: true, subtree: true, characterData: true })
    return () => {
      obs.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [lang, ready, pathname])

  return <div ref={ref}>{children}</div>
}
