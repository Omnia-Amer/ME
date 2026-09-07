/**
 * One-shot content extractor.
 * Parses the legacy hand-authored site (../portfolio/index.html) and emits
 * typed content modules the new React app consumes. Run: node scripts/extract-content.mjs
 * Re-runnable and idempotent. The legacy file stays the source of truth for copy.
 */
import { load } from 'cheerio';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const LEGACY = resolve(here, '../../portfolio/index.html');
const OUT = resolve(here, '../src/content');
mkdirSync(OUT, { recursive: true });

const html = readFileSync(LEGACY, 'utf8');
const $ = load(html, { decodeEntities: false });

const clean = (s) => (s || '').replace(/\s+/g, ' ').trim();
const j = (v) => JSON.stringify(v, null, 2);

/* ---------- helpers ---------- */
function imgOf($el) {
  const el = $el.is('img') ? $el : $el.find('img').first();
  if (!el.length) return null;
  return {
    src: el.attr('src'),
    alt: clean(el.attr('alt') || ''),
    w: Number(el.attr('width')) || undefined,
    h: Number(el.attr('height')) || undefined,
  };
}

/* ---------- HERO ---------- */
const $hero = $('main.page[data-route=""] .hero');
const hero = {
  eyebrow: clean($hero.find('.eyebrow').text()),
  headingHtml: $hero.find('h1').html().trim(),
  lede: clean($hero.find('.lede').text()),
  trustLabel: clean($hero.find('.trust .lbl').text()),
  trust: $hero
    .find('.trust-row a')
    .map((_, a) => ({ name: clean($(a).text()), url: $(a).attr('href') }))
    .get(),
  mosaic: $hero
    .find('.mcell')
    .map((_, c) => {
      const $c = $(c);
      const img = imgOf($c);
      return {
        href: $c.find('a').first().attr('href'),
        tag: clean($c.find('.mtag').text()),
        ...img,
      };
    })
    .get(),
};

/* ---------- IMPACT ---------- */
const $impact = $('#impact');
const impact = {
  eyebrow: clean($impact.find('.eyebrow').text()),
  title: clean($impact.find('h2').text()),
  body: clean($impact.find('.section-head p').text()),
  stats: $impact
    .find('.stat-tile')
    .map((_, t) => ({
      num: clean($(t).find('.stat-num').text()),
      label: clean($(t).find('.stat-lbl').text()),
    }))
    .get(),
};

/* ---------- HOME CTA ---------- */
const $cta = $('main.page[data-route=""] .cta-band');
const homeCta = {
  title: clean($cta.find('h2').text()),
  body: clean($cta.find('.cta-sub').text()),
};

/* ---------- WORK INDEX ---------- */
const workHead = (() => {
  const $h = $('#work .section-head');
  return { eyebrow: clean($h.find('.eyebrow').text()), title: clean($h.find('h2').text()), body: clean($h.find('p').text()) };
})();
const workGroups = [];
$('#work .grid-lbl').each((_, lbl) => {
  const $lbl = $(lbl);
  const $grid = $lbl.next('.card-grid');
  workGroups.push({
    label: clean($lbl.text()),
    cards: $grid
      .find('.pcard')
      .map((_, p) => {
        const $p = $(p);
        return {
          title: clean($p.find('h4').text()),
          tag: clean($p.find('.ptag').text()),
          href: $p.find('a.btn').attr('href'),
          ...imgOf($p.find('.pshot')),
        };
      })
      .get(),
  });
});

/* ---------- CASE STUDIES ---------- */
const cases = [];
$('main.page[data-route^="work/case-"]').each((_, page) => {
  const $page = $(page);
  const id = $page.attr('data-route').replace('work/', '');
  const $wrap = $page.find('.case-detail .wrap');
  const $head = $wrap.find('.cd-head').first();
  const $h3 = $head.find('h3').first();
  const $ar = $h3.find('span[dir="rtl"]').first();
  const titleAr = $ar.length ? clean($ar.text()) : null;
  if ($ar.length) $ar.remove();
  const title = clean($h3.text());

  const meta = $wrap
    .find('.cd-meta > div')
    .map((_, d) => ({ k: clean($(d).find('dt').text()), v: clean($(d).find('dd').text()) }))
    .get();

  const logo = $head.find('.cd-logo').length ? imgOf($head.find('.cd-logo')) : null;

  // body = wrap minus the structured head/meta/back-link; keep every shot/pair/trio/video/copy block
  const $body = $wrap.clone();
  $body.find('.cd-head, .cd-meta, .back-link').remove();
  $body.find('[class]').each((_, e) => {
    const $e = $(e);
    const kept = ($e.attr('class') || '')
      .split(/\s+/)
      .filter((c) => c && c !== 'reveal')
      .join(' ');
    if (kept) $e.attr('class', kept);
    else $e.removeAttr('class');
  });
  $body.find('[style]').removeAttr('style');
  let bodyHtml = $body.html().trim();

  cases.push({
    id,
    num: clean($head.find('.cd-num').text()),
    title,
    titleAr,
    tag: clean($head.find('.cd-tag').text()),
    url: $head.find('.cd-url a').attr('href') || null,
    urlLabel: clean($head.find('.cd-url a').text()) || null,
    logo,
    meta,
    hero: imgOf($wrap.find('.cd-shot, .cd-pair, .cd-trio').first()),
    bodyHtml,
  });
});

/* ---------- ABOUT ---------- */
const $about = $('#about');
const about = {
  eyebrow: clean($about.find('.eyebrow').first().text()),
  title: clean($about.find('h2').first().text()),
  bio: clean($about.find('.bio').text()),
  infobar: $about
    .find('.infobar > div')
    .map((_, d) => ({ k: clean($(d).find('dt').text()), v: clean($(d).find('dd').text()) }))
    .get(),
  skillGroups: $about
    .find('.chip-lbl')
    .map((_, l) => ({
      label: clean($(l).text()),
      chips: $(l)
        .next('.chiprow')
        .find('.chip')
        .map((_, c) => clean($(c).text()))
        .get(),
    }))
    .get(),
  certifications: $about
    .find('.edu-cert .cert-item')
    .map((_, c) => ({ name: clean($(c).find('b').text()), issuer: clean($(c).find('span').text()) }))
    .get(),
  education: $about
    .find('.edu-cert .edu-item')
    .map((_, c) => ({ name: clean($(c).find('b').text()), detail: clean($(c).find('span').text()) }))
    .get(),
  recent: $about
    .find('.recent-grid a')
    .map((_, a) => ({ href: $(a).attr('href'), ...imgOf($(a)) }))
    .get(),
};

/* ---------- PROCESS ---------- */
const process = {
  eyebrow: clean($('#process .eyebrow').text()),
  title: clean($('#process h2').text()),
  body: clean($('#process .section-head p').text()),
  steps: $('#process .acc-item')
    .map((_, it) => ({
      num: clean($(it).find('.acc-num').text()),
      title: clean($(it).find('.acc-head h3').text()),
      body: clean($(it).find('.acc-body p').text()),
    }))
    .get(),
};

/* ---------- SKILLS ---------- */
const $skills = $('#skills');
const skills = {
  eyebrow: clean($skills.find('.eyebrow').first().text()),
  title: clean($skills.find('h2').first().text()),
  body: clean($skills.find('.section-head p').first().text()),
  capabilities: $skills
    .find('.cap-card')
    .map((_, c) => ({ title: clean($(c).find('h4').text()), body: clean($(c).find('p').text()) }))
    .get(),
  matrixTabs: $skills
    .find('.skill-tab')
    .map((_, t) => ({
      cat: $(t).attr('data-cat'),
      label: clean($(t).clone().children().remove().end().text()),
      n: clean($(t).find('.skill-tab-n').text()),
    }))
    .get(),
  matrix: $skills
    .find('#skillGrid .skill-card')
    .map((_, c) => ({
      cat: $(c).attr('data-cat'),
      name: clean($(c).find('.skill-name').text()),
      body: clean($(c).find('.skill-body p').text()),
    }))
    .get(),
  tools: $skills
    .find('.tool-badge')
    .map((_, t) => ({ mono: clean($(t).find('.tool-mono').text()), name: clean($(t).find('span').last().text()) }))
    .get(),
  toolsHead: (() => {
    const $s = $skills.find('.skills-subhead').last();
    return { title: clean($s.find('h3').text()), body: clean($s.find('p').text()) };
  })(),
  matrixHead: (() => {
    const $s = $skills.find('.skills-subhead').first();
    return { title: clean($s.find('h3').text()), body: clean($s.find('p').text()) };
  })(),
};

/* ---------- CONTACT + FAQ ---------- */
const $contact = $('main.page[data-route="contact"]');
const contact = {
  ctaTitle: clean($contact.find('.cta-band h2').text()),
  ctaBody: clean($contact.find('.cta-band .cta-sub').text()),
  formHead: {
    eyebrow: clean($contact.find('#contact-form .eyebrow').text()),
    title: clean($contact.find('#contact-form h2').text()),
    body: clean($contact.find('#contact-form .section-head p').text()),
  },
  endpoint: $contact.find('form').attr('action'),
  topics: $contact
    .find('select[name="topic"] option')
    .map((_, o) => clean($(o).text()))
    .get(),
  email: 'Omniaamer835@gmail.com',
  phone: '201558092205',
  faq: $('#faq .acc-item')
    .map((_, it) => ({ q: clean($(it).find('.acc-head h3').text()), a: clean($(it).find('.acc-body p').text()) }))
    .get(),
  faqHead: {
    eyebrow: clean($('#faq .eyebrow').text()),
    title: clean($('#faq h2').text()),
    body: clean($('#faq .section-head p').text()),
  },
};

/* ---------- FOOTER ---------- */
const footer = {
  tagline: clean($('footer.site .foot-tagline').text()),
  social: $('footer.site .foot-social a')
    .map((_, a) => ({ label: clean($(a).attr('aria-label')), url: $(a).attr('href') }))
    .get(),
  columns: $('footer.site .foot-col')
    .map((_, col) => ({
      title: clean($(col).find('.foot-col-title').text()),
      links: $(col)
        .find('a')
        .map((_, a) => ({ label: clean($(a).text()), href: $(a).attr('href'), download: $(a).attr('download') != null }))
        .get(),
    }))
    .get(),
  copy: clean($('footer.site .foot-copy').text()),
  madeby: clean($('footer.site .foot-madeby').text()),
};

/* ---------- WRITE ---------- */
const banner = '// AUTO-GENERATED by scripts/extract-content.mjs — do not edit by hand.\n// Source of truth: ../../portfolio/index.html\n';
writeFileSync(resolve(OUT, 'cases.generated.ts'), banner + `export const cases = ${j(cases)} as const;\nexport type CaseStudy = (typeof cases)[number];\n`);
writeFileSync(
  resolve(OUT, 'site.generated.ts'),
  banner +
    `export const hero = ${j(hero)} as const;\n` +
    `export const impact = ${j(impact)} as const;\n` +
    `export const homeCta = ${j(homeCta)} as const;\n` +
    `export const workHead = ${j(workHead)} as const;\n` +
    `export const workGroups = ${j(workGroups)} as const;\n` +
    `export const about = ${j(about)} as const;\n` +
    `export const process = ${j(process)} as const;\n` +
    `export const skills = ${j(skills)} as const;\n` +
    `export const contact = ${j(contact)} as const;\n` +
    `export const footer = ${j(footer)} as const;\n`,
);

console.log(`cases: ${cases.length}`);
console.log(`mosaic tiles: ${hero.mosaic.length}, stats: ${impact.stats.length}`);
console.log(`work groups: ${workGroups.map((g) => g.label + '=' + g.cards.length).join(', ')}`);
console.log(`about certs: ${about.certifications.length}, edu: ${about.education.length}, skill matrix: ${skills.matrix.length}`);
console.log(`faq: ${contact.faq.length}, process steps: ${process.steps.length}`);
