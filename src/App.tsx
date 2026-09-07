import { lazy, Suspense } from 'react'
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { LangProvider } from '@/i18n/LangProvider'
import { Localize } from '@/i18n/Localize'
import { MotionReadyProvider } from '@/lib/MotionReady'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Home } from '@/pages/Home'

const Work = lazy(() => import('@/pages/Work').then((m) => ({ default: m.Work })))
const CaseStudy = lazy(() => import('@/pages/CaseStudy').then((m) => ({ default: m.CaseStudy })))
const About = lazy(() => import('@/pages/About').then((m) => ({ default: m.About })))
const Process = lazy(() => import('@/pages/Process').then((m) => ({ default: m.Process })))
const Skills = lazy(() => import('@/pages/Skills').then((m) => ({ default: m.Skills })))
const Contact = lazy(() => import('@/pages/Contact').then((m) => ({ default: m.Contact })))
const NotFound = lazy(() => import('@/pages/NotFound').then((m) => ({ default: m.NotFound })))

function Fallback() {
  return <div className="pt-40 text-center font-mono text-[12px] text-ink-faint">Loading…</div>
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<Fallback />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/work/:id" element={<CaseStudy />} />
          <Route path="/about" element={<About />} />
          <Route path="/process" element={<Process />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <HashRouter>
      <LangProvider>
        <MotionReadyProvider>
          <Localize>
            <a
              href="#main-content"
              className="sr-only fixed left-3 top-3 z-[1000] rounded-md bg-ink px-4 py-2.5 font-mono text-[12px] text-bg focus:not-sr-only"
            >
              Skip to content
            </a>
            <div className="u-grain min-h-screen">
              <Header />
              <AnimatedRoutes />
              <Footer />
            </div>
          </Localize>
        </MotionReadyProvider>
      </LangProvider>
    </HashRouter>
  )
}
