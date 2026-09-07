import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Page } from '@/components/Page'
import { Reveal } from '@/components/Reveal'
import { Eyebrow } from '@/components/Eyebrow'
import { Button, ArrowUpRight } from '@/components/Button'
import { hero, impact, homeCta, workGroups } from '@/content/site.generated'
import { asset, hrefToPath } from '@/lib/paths'
import { easeOutExpo } from '@/lib/motion'
import { useIsMotionReady } from '@/lib/MotionReady'
import { Marquee } from '@/components/ui/marquee'

function HeroHeading() {
  const html = hero.headingHtml
  const m = html.match(/^(.*?)<em>(.*?)<\/em>(.*)$/)
  const [before, em, after] = m ? [m[1], m[2], m[3]] : [html, '', '']
  return (
    <h1 className="max-w-[16ch] text-[clamp(2.6rem,6.4vw,4.75rem)] font-medium leading-[1.04] tracking-[-0.02em] md:max-w-[20ch]">
      {before}
      <span className="text-accent">{em}</span>
      {after}
    </h1>
  )
}

/** Above-the-fold entrance: fade+rise with a small per-item delay. */
function In({ i = 0, children, className }: { i?: number; children: React.ReactNode; className?: string }) {
  const ready = useIsMotionReady()
  if (!ready) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.05 + i * 0.09 }}
    >
      {children}
    </motion.div>
  )
}

export function Home() {
  return (
    <Page title="Senior UI/UX Designer">
      <section className="u-wrap flex flex-col items-center pb-24 pt-16 text-center md:pt-24">
        <div className="flex flex-col items-center gap-6">
          <In i={0}>
            <Eyebrow>{hero.eyebrow}</Eyebrow>
          </In>
          <In i={1}>
            <HeroHeading />
          </In>
          <In i={2} className="max-w-[600px] text-[1.06rem] leading-relaxed text-ink-soft">
            {hero.lede}
          </In>
          <In i={3} className="flex flex-wrap justify-center gap-4">
            <Button to="/work" variant="solid">
              View Case Studies
            </Button>
            <Button to="/contact">Get in Touch</Button>
          </In>
          <In i={4} className="mt-6 flex flex-col items-center gap-3">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-faint">{hero.trustLabel}</span>
            <div className="flex flex-wrap justify-center gap-8 font-display text-[18px] text-ink-faint">
              {hero.trust.map((tr) => (
                <a
                  key={tr.name}
                  href={tr.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-all duration-200 hover:scale-110 hover:font-bold hover:text-ink"
                >
                  {tr.name}
                </a>
              ))}
            </div>
          </In>
        </div>

        <Reveal className="mt-16 w-full max-w-[1200px]">
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {hero.mosaic.map((tile) => (
              <Link
                key={tile.href}
                to={hrefToPath(tile.href)}
                className="group relative mb-4 block break-inside-avoid overflow-hidden rounded-[22px] border border-line bg-surface-2 p-2"
              >
                <img
                  src={asset(tile.src)}
                  alt={tile.alt}
                  width={tile.w}
                  height={tile.h}
                  loading="lazy"
                  className="rounded-[14px] grayscale-[0.9] transition-all duration-500 group-hover:scale-[1.02] group-hover:grayscale-0"
                />
                <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/50 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-white backdrop-blur">
                  {tile.tag}
                </span>
                <span className="absolute inset-x-4 bottom-4 flex translate-y-2 items-center justify-center gap-2 rounded-full border border-white/20 bg-black/55 px-4 py-2.5 font-mono text-[12px] text-white opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  View case study <ArrowUpRight />
                </span>
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      {/* scrolling roster of every shipped product — 21st.dev / MagicUI marquee */}
      <section className="border-y border-line py-8" aria-label="Selected work">
        <Marquee pauseOnHover className="[--duration:60s]">
          {(workGroups as readonly { cards: readonly { title: string; href: string }[] }[])
            .flatMap((g) => g.cards)
            .map((c) => (
              <Link
                key={c.href}
                to={hrefToPath(c.href)}
                className="mx-1.5 inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-line px-5 py-2 font-mono text-[12px] text-ink-soft transition-colors hover:border-accent hover:text-ink"
              >
                <span className="size-1 rounded-full bg-accent/70" />
                {c.title}
              </Link>
            ))}
        </Marquee>
      </section>

      <section className="border-t border-line py-24">
        <div className="u-wrap">
          <div className="mb-12 max-w-2xl">
            <Reveal>
              <Eyebrow>{impact.eyebrow}</Eyebrow>
              <h2 className="mt-4 text-[clamp(2rem,4.4vw,3rem)]">{impact.title}</h2>
              <p className="mt-4 max-w-xl text-[1.03rem] text-ink-soft">{impact.body}</p>
            </Reveal>
          </div>
          <div className="grid gap-px overflow-hidden rounded-[22px] border border-line bg-line sm:grid-cols-2 md:grid-cols-4">
            {impact.stats.map((st, i) => (
              <Reveal key={st.label} delay={i * 0.06} className="bg-surface">
                <div className="p-8 text-center">
                  <div className="font-display text-[clamp(1.9rem,4vw,2.6rem)] font-semibold">{st.num}</div>
                  <div className="mt-2 font-mono text-[11.5px] text-ink-faint">{st.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line py-28 text-center">
        <div className="u-wrap">
          <Reveal>
            <h2 className="mx-auto max-w-3xl text-[clamp(2rem,5vw,3.4rem)]">{homeCta.title}</h2>
            <p className="mx-auto mt-6 max-w-xl text-[1.03rem] text-ink-soft">{homeCta.body}</p>
            <div className="mt-8 flex justify-center">
              <Button to="/contact" variant="solid">
                Get in Touch <ArrowUpRight />
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </Page>
  )
}
