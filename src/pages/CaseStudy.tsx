import { useMemo, useRef } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Page } from '@/components/Page'
import { Reveal } from '@/components/Reveal'
import { Eyebrow } from '@/components/Eyebrow'
import { ArrowUpRight } from '@/components/Button'
import { Lightbox } from '@/components/Lightbox'
import { cases } from '@/content/cases.generated'
import { asset, withBaseHtml } from '@/lib/paths'

export function CaseStudy() {
  const { id } = useParams()
  const ref = useRef<HTMLDivElement>(null)

  const idx = cases.findIndex((c) => c.id === id)
  const study = idx >= 0 ? cases[idx] : null
  const bodyHtml = useMemo(() => (study ? withBaseHtml(study.bodyHtml) : ''), [study])

  if (!study) return <Navigate to="/work" replace />

  const prev = cases[(idx - 1 + cases.length) % cases.length]
  const next = cases[(idx + 1) % cases.length]

  return (
    <Page title={study.title}>
      <article className="u-wrap py-14">
        <Reveal>
          <Link
            to="/work"
            className="mb-8 inline-flex items-center gap-2 font-mono text-[12px] text-ink-faint transition-colors hover:text-ink"
          >
            ← Back to all work
          </Link>
        </Reveal>

        <Reveal className="flex flex-wrap items-start gap-5">
          <span className="grid size-12 shrink-0 place-items-center rounded-full border border-line-strong font-mono text-[14px] text-ink-faint u-ltr">
            {study.num}
          </span>
          <div className="min-w-0 flex-1">
            <Eyebrow>Case study</Eyebrow>
            <h1 className="mt-3 text-[clamp(1.7rem,3.6vw,2.5rem)]">
              {study.title}
              {study.titleAr && (
                <span className="ms-3 align-middle text-[0.55em] text-ink-faint" dir="rtl">
                  {study.titleAr}
                </span>
              )}
            </h1>
            <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.06em] text-ink-faint">{study.tag}</div>
            {study.url && (
              <a
                href={study.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 border-b border-line-strong pb-0.5 font-mono text-[12.5px] text-ink-soft transition-colors hover:text-accent"
              >
                {study.urlLabel ?? 'Visit site'} <ArrowUpRight size={11} />
              </a>
            )}
          </div>
          {study.logo?.src && (
            <img
              src={asset(study.logo.src)}
              alt={study.logo.alt}
              className="hidden h-11 w-auto self-center sm:block"
            />
          )}
        </Reveal>

        <Reveal>
          <dl className="my-8 grid grid-cols-2 gap-4 border-y border-line py-6 sm:grid-cols-4">
            {study.meta.map((m) => (
              <div key={m.k}>
                <dt className="mb-2 font-mono text-[10px] uppercase tracking-[0.08em] text-ink-faint">{m.k}</dt>
                <dd className="text-[14px]">{m.v}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <div
          ref={ref}
          className="case-body"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
        <Lightbox containerRef={ref} active={study.id} />

        {/* prev / next */}
        <nav className="mt-16 grid gap-4 border-t border-line pt-10 sm:grid-cols-2">
          <Link
            to={`/work/${prev.id}`}
            className="group rounded-2xl border border-line p-6 transition-colors hover:border-line-strong"
          >
            <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-faint">Previous project</div>
            <div className="mt-1 font-display text-[1.1rem] group-hover:text-accent">{prev.title}</div>
          </Link>
          <Link
            to={`/work/${next.id}`}
            className="group rounded-2xl border border-line p-6 text-end transition-colors hover:border-line-strong"
          >
            <div className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-faint">Next project</div>
            <div className="mt-1 font-display text-[1.1rem] group-hover:text-accent">{next.title}</div>
          </Link>
        </nav>
      </article>
    </Page>
  )
}
