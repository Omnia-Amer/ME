import { Page } from '@/components/Page'
import { SectionHead } from '@/components/SectionHead'
import { Accordion } from '@/components/Accordion'
import { Button } from '@/components/Button'
import { process } from '@/content/site.generated'

export function Process() {
  return (
    <Page title="Process">
      <section className="u-wrap py-16">
        <SectionHead eyebrow={process.eyebrow} title={process.title} body={process.body}>
          <Button to="/contact">Book a Call</Button>
          <Button to="/work" variant="solid">
            See Case Studies
          </Button>
        </SectionHead>
        <Accordion items={process.steps} startOpen={0} />
      </section>
    </Page>
  )
}
