import { Link } from 'react-router-dom'
import { Page } from '@/components/Page'
import { Reveal } from '@/components/Reveal'
import { Eyebrow } from '@/components/Eyebrow'
import { ArrowUpRight } from '@/components/Button'
import { about } from '@/content/site.generated'
import { asset, hrefToPath } from '@/lib/paths'

export function About() {
  return (
    <Page title="About">
      <section className="u-wrap py-16">
        <div className="grid gap-16 lg:grid-cols-[1.15fr_.85fr]">
          <Reveal>
            <Eyebrow>{about.eyebrow}</Eyebrow>
            <h1 className="mt-4 text-[clamp(2.4rem,5.4vw,3.6rem)]">{about.title}</h1>
            <p className="mt-6 max-w-[560px] text-[1.03rem] leading-relaxed text-ink-soft">{about.bio}</p>

            <dl className="my-8 flex flex-wrap gap-8 border-y border-line py-6">
              {about.infobar.map((it) => (
                <div key={it.k}>
                  <dt className="mb-2 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">{it.k}</dt>
                  <dd className="text-[14.5px]">{it.v}</dd>
                </div>
              ))}
            </dl>

            {about.skillGroups.map((g) => (
              <div key={g.label} className="mb-4">
                <div className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-faint">{g.label}</div>
                <div className="flex flex-wrap gap-2">
                  {g.chips.map((c) => (
                    <span key={c} className="rounded-full border border-line-strong px-4 py-2 font-mono text-[12px] text-ink-soft">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-14 grid gap-12 sm:grid-cols-2">
              <div>
                <h3 className="mb-4 font-mono text-[13px] uppercase tracking-[0.08em] text-ink-faint">Certifications</h3>
                {about.certifications.map((c) => (
                  <div key={c.name} className="border-t border-line py-4">
                    <b className="block text-[14.5px] font-medium">{c.name}</b>
                    <span className="mt-1 block font-mono text-[12.5px] text-ink-faint">{c.issuer}</span>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="mb-4 font-mono text-[13px] uppercase tracking-[0.08em] text-ink-faint">Education</h3>
                {about.education.map((e) => (
                  <div key={e.name} className="border-t border-line py-4">
                    <b className="block text-[14.5px] font-medium">{e.name}</b>
                    <span className="mt-1 block font-mono text-[12.5px] text-ink-faint">{e.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mb-4 flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.08em] text-ink-faint">
              Recent works <ArrowUpRight />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {about.recent.map((r) => (
                <Link key={r.href} to={hrefToPath(r.href)} className="group overflow-hidden rounded-[14px] border border-line">
                  {r.src && (
                    <img
                      src={asset(r.src)}
                      alt={r.alt}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover object-top grayscale-[0.9] transition-all duration-500 group-hover:grayscale-0"
                    />
                  )}
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </Page>
  )
}
