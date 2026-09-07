import { useState } from 'react'
import { Page } from '@/components/Page'
import { Reveal } from '@/components/Reveal'
import { SectionHead } from '@/components/SectionHead'
import { Accordion } from '@/components/Accordion'
import { Button } from '@/components/Button'
import { contact } from '@/content/site.generated'
import { asset } from '@/lib/paths'
import { useLang } from '@/i18n/LangProvider'

const AJAX = 'https://formsubmit.co/ajax/Omniaamer835@gmail.com'

type Status = { kind: 'idle' | 'sending' | 'ok' | 'err'; wa?: string }

export function Contact() {
  const { lang } = useLang()
  const ar = lang === 'ar'
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const g = (k: string) => (data.get(k) || '').toString().trim()
    if (g('_honey')) return
    const name = g('name'),
      company = g('company'),
      email = g('email'),
      topic = g('topic'),
      message = g('message')
    if (!name || !message) {
      form.reportValidity()
      return
    }
    const head = ['Portfolio enquiry', `Name: ${name}`]
    if (company) head.push(`Company: ${company}`)
    if (email) head.push(`Email: ${email}`)
    head.push(`About: ${topic}`)
    const text = `${head.join('\n')}\n\n${message}`
    const wa = `https://wa.me/${contact.phone}?text=${encodeURIComponent(text)}`

    setStatus({ kind: 'sending', wa })
    try {
      const r = await fetch(AJAX, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name,
          company: company || '—',
          email: email || '—',
          topic,
          message,
          _subject: 'New portfolio enquiry — portfolio v2',
          _template: 'table',
        }),
      })
      const res = await r.json()
      if (res && (res.success === true || res.success === 'true')) {
        setStatus({ kind: 'ok', wa })
        form.reset()
      } else setStatus({ kind: 'err', wa })
    } catch {
      setStatus({ kind: 'err', wa })
    }
  }

  return (
    <Page title="Contact">
      <section className="u-wrap py-16 text-center">
        <Reveal>
          <h1 className="mx-auto max-w-3xl text-[clamp(2rem,5vw,3.4rem)]">{contact.ctaTitle}</h1>
          <p className="mx-auto mt-6 max-w-xl text-[1.03rem] text-ink-soft">{contact.ctaBody}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href={`mailto:${contact.email}`} variant="solid">
              Email Me
            </Button>
            <Button href={`https://wa.me/${contact.phone}`}>WhatsApp</Button>
            <Button href={asset('assets/Omnia_Amer_CV_2026.pdf')} download>
              Download CV
            </Button>
          </div>
        </Reveal>
      </section>

      <section className="border-t border-line py-16">
        <div className="u-wrap">
          <SectionHead
            eyebrow={contact.formHead.eyebrow}
            title={contact.formHead.title}
            body={<FormHeadBody />}
          />
          <Reveal>
            <form onSubmit={onSubmit} className="flex max-w-[640px] flex-col gap-[18px]">
              <input type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px]" />
              <div className="grid gap-[18px] sm:grid-cols-2">
                <Field label="Your name" required>
                  <input name="name" required autoComplete="name" className={inputCls} />
                </Field>
                <Field label="Company / organisation">
                  <input name="company" autoComplete="organization" className={inputCls} />
                </Field>
              </div>
              <div className="grid gap-[18px] sm:grid-cols-2">
                <Field label="Email">
                  <input type="email" name="email" autoComplete="email" placeholder="so I can reply here too" className={inputCls} />
                </Field>
                <Field label="I'm reaching out about">
                  <select name="topic" className={inputCls} defaultValue={contact.topics[0]}>
                    {contact.topics.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field label="Message" required>
                <textarea
                  name="message"
                  rows={5}
                  required
                  placeholder="A few lines about the role or project, timeline, and anything you'd like me to know."
                  className={`${inputCls} min-h-[120px] resize-y`}
                />
              </Field>
              <div className="mt-1 flex flex-wrap items-center gap-4">
                <Button type="submit" variant="solid">
                  <span data-no-i18n>
                    {status.kind === 'sending' ? (ar ? 'جارٍ الإرسال…' : 'Sending…') : ar ? 'إرسال الرسالة' : 'Send message'}
                  </span>
                </Button>
                <a
                  href={status.wa ?? `https://wa.me/${contact.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[13px] text-ink-soft underline decoration-line-strong underline-offset-4 hover:text-ink"
                >
                  or message on WhatsApp
                </a>
              </div>

              {status.kind !== 'idle' && status.kind !== 'sending' && (
                <div
                  data-no-i18n
                  className={`mt-3 max-w-[640px] rounded-md border bg-surface-2 p-4 text-[14px] leading-relaxed text-ink-soft ${
                    status.kind === 'ok' ? 'border-green-500/40' : 'border-amber-400/50'
                  }`}
                >
                  {status.kind === 'ok' ? (
                    <>
                      <strong className="text-ink">Message sent ✓</strong> — it&apos;s on its way to Omnia&apos;s inbox.{' '}
                      <a href={status.wa} target="_blank" rel="noopener noreferrer" className="text-ink underline">
                        Open WhatsApp
                      </a>{' '}
                      with the same message ready to send.
                    </>
                  ) : (
                    <>
                      The email didn&apos;t go through just now. Reach Omnia directly —{' '}
                      <a href={status.wa} target="_blank" rel="noopener noreferrer" className="text-ink underline">
                        send it on WhatsApp
                      </a>{' '}
                      (your message is pre-filled), or{' '}
                      <a href={`mailto:${contact.email}`} className="text-ink underline">
                        email it
                      </a>
                      .
                    </>
                  )}
                </div>
              )}
            </form>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line py-16">
        <div className="u-wrap">
          <SectionHead eyebrow={contact.faqHead.eyebrow} title={contact.faqHead.title} body={contact.faqHead.body} />
          <div className="max-w-[760px]">
            <Accordion items={contact.faq.map((f) => ({ title: f.q, body: f.a }))} startOpen={0} />
          </div>
        </div>
      </section>
    </Page>
  )
}

function FormHeadBody() {
  // Split at the email so the DOM translator matches the legacy AR key,
  // which stops just before the address.
  const full = contact.formHead.body
  const at = full.indexOf(contact.email)
  const before = at >= 0 ? full.slice(0, at) : full
  const after = at >= 0 ? full.slice(at + contact.email.length) : ''
  return (
    <>
      {before}
      <a href={`mailto:${contact.email}`} className="border-b border-line-strong">
        {contact.email}
      </a>
      {after}
    </>
  )
}

const inputCls =
  'w-full rounded-md border border-line bg-surface-2 px-3.5 py-3 font-body text-[15px] text-ink outline-none transition-colors focus:border-line-strong focus:bg-surface-3 placeholder:text-ink-faint appearance-none'

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink-faint">
        {label} {required && <span className="text-ink">*</span>}
      </span>
      {children}
    </label>
  )
}
