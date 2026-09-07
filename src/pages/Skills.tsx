import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Page } from '@/components/Page'
import { Reveal } from '@/components/Reveal'
import { SectionHead } from '@/components/SectionHead'
import { skills } from '@/content/site.generated'
import { useIsMotionReady } from '@/lib/MotionReady'

export function Skills() {
  const ready = useIsMotionReady()
  const [cat, setCat] = useState('all')
  const [openName, setOpenName] = useState<string | null>(null)
  const matrix = skills.matrix.filter((m) => cat === 'all' || m.cat === cat)

  return (
    <Page title="Skills">
      <section className="u-wrap py-16">
        <SectionHead eyebrow={skills.eyebrow} title={skills.title} body={skills.body} />

        {/* capability cards */}
        <div className="grid gap-px overflow-hidden rounded-[22px] border border-line bg-line md:grid-cols-2">
          {skills.capabilities.map((c, i) => (
            <Reveal key={c.title} delay={(i % 2) * 0.06} className="bg-surface">
              <div className="flex h-full flex-col gap-3 p-8">
                <span className="grid size-10 place-items-center rounded-[10px] border border-line-strong text-accent">
                  <span className="size-2 rounded-full bg-accent" />
                </span>
                <h3 className="text-[19px] font-medium">{c.title}</h3>
                <p className="text-[14.5px] text-ink-soft">{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* matrix */}
        <div className="mt-20">
          <Reveal className="mb-7">
            <h3 className="text-[clamp(1.5rem,3vw,2rem)]">{skills.matrixHead.title}</h3>
            <p className="mt-2 max-w-[560px] text-[15px] text-ink-soft">{skills.matrixHead.body}</p>
          </Reveal>
          <Reveal className="mb-8 flex flex-wrap gap-2">
            {skills.matrixTabs.map((tabItem) => (
              <button
                key={tabItem.cat}
                onClick={() => setCat(tabItem.cat)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[12px] transition-colors ${
                  cat === tabItem.cat
                    ? 'border-ink bg-ink text-bg'
                    : 'border-line-strong text-ink-soft hover:border-accent hover:text-ink'
                }`}
              >
                {tabItem.label}
                <span
                  className={`rounded-full border px-1.5 text-[10.5px] ${cat === tabItem.cat ? 'border-bg/30' : 'border-line text-ink-faint'}`}
                >
                  {tabItem.n}
                </span>
              </button>
            ))}
          </Reveal>

          <motion.div layout className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {matrix.map((m) => {
                const open = openName === m.name
                return (
                  <motion.div
                    key={m.name}
                    data-reveal=""
                    layout={ready}
                    initial={ready ? { opacity: 0, y: 12 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden rounded-md border border-line bg-surface"
                  >
                    <button
                      className="flex w-full items-center gap-3 p-4 text-start"
                      onClick={() => setOpenName(open ? null : m.name)}
                      aria-expanded={open}
                    >
                      <span className="grid size-8 shrink-0 place-items-center rounded-[9px] border border-line-strong text-ink-soft">
                        <span className="size-1.5 rounded-full bg-current" />
                      </span>
                      <span className="flex-1 text-[14px] font-medium leading-tight">{m.name}</span>
                      <span
                        className={`grid size-6 shrink-0 place-items-center rounded-full border border-line-strong transition-transform ${open ? 'rotate-45 text-accent' : 'text-ink-faint'}`}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </span>
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.p
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-4 pb-4 ps-[3.75rem] text-[13px] leading-relaxed text-ink-soft"
                        >
                          {m.body}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* tools */}
        <div className="mt-20">
          <Reveal className="mb-6">
            <h3 className="text-[clamp(1.5rem,3vw,2rem)]">{skills.toolsHead.title}</h3>
            <p className="mt-2 max-w-[560px] text-[15px] text-ink-soft">{skills.toolsHead.body}</p>
          </Reveal>
          <div className="flex flex-wrap gap-3">
            {skills.tools.map((tool) => (
              <Reveal key={tool.name} as="div">
                <div className="flex items-center gap-2.5 rounded-full border border-line bg-surface py-2 pe-4 ps-2 transition-colors hover:border-line-strong">
                  <span className="grid size-7 place-items-center rounded-full bg-ink/[0.08] font-mono text-[11.5px] font-semibold">
                    {tool.mono}
                  </span>
                  <span className="text-[13.5px] text-ink-soft">{tool.name}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </Page>
  )
}
