const BASE = import.meta.env.BASE_URL // e.g. "/" or "/portfolio-v2/"

/** Legacy hash hrefs ("#/work/case-qnl", "#/") -> router paths ("/work/case-qnl", "/"). */
export function hrefToPath(href: string | undefined | null): string {
  if (!href) return '/'
  let h = href.trim()
  if (h.startsWith('#/')) h = h.slice(1)
  else if (h === '#' || h === '') h = '/'
  if (!h.startsWith('/')) h = '/' + h
  return h.replace(/\/$/, '') || '/'
}

/** Prefix a bundled public asset path with the deploy base. */
export function asset(src: string): string {
  return BASE + src.replace(/^\/+/, '')
}

/** Rewrite asset() paths inside a raw HTML string (case-study bodies). */
export function withBaseHtml(html: string): string {
  return html.replace(/(src|href|poster)="assets\//g, `$1="${BASE}assets/`)
}

export const isExternal = (href: string) => /^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')
