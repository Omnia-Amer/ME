import { Page } from '@/components/Page'
import { Button } from '@/components/Button'

export function NotFound() {
  return (
    <Page title="Not found">
      <section className="u-wrap flex min-h-[50vh] flex-col items-center justify-center gap-6 py-24 text-center">
        <h1 className="text-[clamp(2rem,5vw,3rem)]">404 — page not found</h1>
        <p className="text-ink-soft">That route does not exist.</p>
        <Button to="/" variant="solid">
          Go home
        </Button>
      </section>
    </Page>
  )
}
