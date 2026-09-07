import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Page } from '@/components/Page'
import { Reveal } from '@/components/Reveal'
import { SectionHead } from '@/components/SectionHead'
import { ArrowUpRight } from '@/components/Button'
import { workHead, workGroups } from '@/content/site.generated'
import { asset, hrefToPath } from '@/lib/paths'
import { useIsMotionReady } from '@/lib/MotionReady'

export function Work() {
  const ready = useIsMotionReady()
  return (
    <Page title="Work">
      <section className="u-wrap py-16">
        <SectionHead eyebrow={workHead.eyebrow} title={workHead.title} body={workHead.body} />

        {workGroups.map((group) => (
          <div key={group.label} className="mt-14 first:mt-0">
            <Reveal className="mb-6 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.1em] text-ink-faint">
              <span>{group.label}</span>
              <motion.span
                className="h-px flex-1 origin-left bg-line"
                initial={ready ? { scaleX: 0 } : false}
                whileInView={ready ? { scaleX: 1 } : undefined}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              />
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.cards.map((card, i) => (
                <Reveal key={card.href} as="article" delay={(i % 3) * 0.06}>
                  <motion.div
                    whileHover={ready ? { y: -6 } : undefined}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    className="h-full"
                  >
                    <Link
                      to={hrefToPath(card.href)}
                      className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-line bg-surface transition-colors hover:border-line-strong"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-surface-2">
                        {card.src && (
                          <img
                            src={asset(card.src)}
                            alt={card.alt}
                            loading="lazy"
                            className="size-full object-cover object-top grayscale-[0.9] transition-all duration-500 group-hover:scale-[1.05] group-hover:grayscale-0"
                          />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="mb-2 text-[17px] font-medium">{card.title}</h3>
                        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.06em] text-ink-faint">{card.tag}</p>
                        <span className="mt-auto inline-flex items-center gap-2 font-mono text-[12px] text-ink-soft transition-colors group-hover:text-accent">
                          View case study <ArrowUpRight />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        ))}
      </section>
    </Page>
  )
}
