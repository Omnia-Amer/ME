import { useEffect } from 'react'
import { useLang } from './LangProvider'
import { norm, SUPPLEMENT_AR } from './dict'

const originalText = new WeakMap<Text, string>()

/**
 * Walks the text nodes of `ref` and swaps English -> Arabic using the legacy
 * dictionary — the same mechanism the old site used, scoped to one subtree.
 * Used for case-study bodies rendered via dangerouslySetInnerHTML.
 */
export function useDomTranslate(
  ref: React.RefObject<HTMLElement | null>,
  deps: readonly unknown[] = [],
) {
  const { lang } = useLang()

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const dict: Record<string, string> = {
      ...(typeof window !== 'undefined' && window.I18N_AR ? window.I18N_AR : {}),
      ...SUPPLEMENT_AR,
    }

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const p = node.parentElement
        if (!p) return NodeFilter.FILTER_REJECT
        if (p.tagName === 'SCRIPT' || p.tagName === 'STYLE') return NodeFilter.FILTER_REJECT
        if (!node.nodeValue || !/\S/.test(node.nodeValue)) return NodeFilter.FILTER_REJECT
        return NodeFilter.FILTER_ACCEPT
      },
    })

    let node: Node | null
    while ((node = walker.nextNode())) {
      const text = node as Text
      if (!originalText.has(text)) originalText.set(text, text.nodeValue ?? '')
      const original = originalText.get(text)!
      if (lang === 'en') {
        text.nodeValue = original
        continue
      }
      text.nodeValue = dict[norm(original)] ?? original
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, ref, ...deps])
}
