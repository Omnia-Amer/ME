/** Normalise a string the same way the legacy AR dictionary keys were built. */
export function norm(s: string): string {
  return String(s)
    .replace(/ /g, ' ')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Supplementary EN -> AR strings for copy that is new in v2 (chrome, labels,
 * buttons) and therefore absent from the legacy /i18n-ar.js dictionary.
 */
export const SUPPLEMENT_AR: Record<string, string> = {
  // nav
  Work: 'الأعمال',
  About: 'نبذة',
  Process: 'المنهجية',
  Skills: 'المهارات',
  Contact: 'تواصل',
  "Let's Talk": 'لنتحدث',
  'Skip to content': 'تخطَّ إلى المحتوى',
  // theme / lang
  'Switch to light theme': 'التبديل إلى الوضع الفاتح',
  'Switch to dark theme': 'التبديل إلى الوضع الداكن',
  'Switch language': 'تغيير اللغة',
  // generic
  'View case study': 'اطّلع على دراسة الحالة',
  'View Case Study': 'اطّلع على دراسة الحالة',
  'All work': 'كل الأعمال',
  'Back to all work': 'العودة إلى كل الأعمال',
  'Selected work': 'أعمال مختارة',
  'Next project': 'المشروع التالي',
  'Previous project': 'المشروع السابق',
  Client: 'العميل',
  Role: 'الدور',
  Year: 'السنة',
  Via: 'عبر',
  'Visit site': 'زيارة الموقع',
  '404 — page not found': '404 — الصفحة غير موجودة',
  'That route does not exist.': 'هذا المسار غير موجود.',
  'Go home': 'العودة للرئيسية',
  'Loading…': 'جارٍ التحميل…',
  // section eyebrows / labels added in v2
  'Case study': 'دراسة حالة',
  'See all 18 case studies': 'اطّلع على جميع دراسات الحالة الـ18',
  // legacy dict still says "(07)" here — the 18th case shifted the count
  'Featured Projects (08)': 'مشاريع مختارة (08)',
  'Send message': 'إرسال الرسالة',
  'Sending…': 'جارٍ الإرسال…',
  'or message on WhatsApp': 'أو راسلني على واتساب',
  'so I can reply here too': 'حتى أتمكّن من الرد هنا أيضًا',
  "A few lines about the role or project, timeline, and anything you'd like me to know.":
    'أسطر قليلة عن الوظيفة أو المشروع والجدول الزمني وأي شيء تودّ إخباري به.',
}
