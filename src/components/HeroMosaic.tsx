import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight } from './Button'
import { hero } from '@/content/site.generated'
import { asset, hrefToPath } from '@/lib/paths'
import { easeOutExpo } from '@/lib/motion'
import { useIsMotionReady } from '@/lib/MotionReady'

type Tile = (typeof hero.mosaic)[number]

// A representative slice for the home page; the full set lives on /work.
const TILES = hero.mosaic.slice(0, 9)

function Cell({ tile, i }: { tile: Tile; i: number }) {
  const ready = useIsMotionReady()
  return (
    <motion.div
      className="mb-4 break-inside-avoid"
      data-reveal=""
      initial={ready ? { opacity: 0, y: 40 } : false}
      whileInView={ready ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.7, ease: easeOutExpo, delay: (i % 3) * 0.07 }}
    >
      <motion.div
        whileHover={ready ? { scale: 1.015, rotate: i % 2 ? -0.5 : 0.5 } : undefined}
        transition={{ type: 'spring', stiffness: 280, damping: 20 }}
        className="group relative overflow-hidden rounded-[22px] border border-line bg-surface-2 p-2"
      >
        <Link to={hrefToPath(tile.href)} className="block">
          <img
            src={asset(tile.src)}
            alt={tile.alt}
            width={tile.w}
            height={tile.h}
            loading="lazy"
            className="rounded-[14px] grayscale-[0.9] transition-[filter] duration-700 group-hover:grayscale-0"
          />
          <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/50 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-white backdrop-blur">
            {tile.tag}
          </span>
          <span className="absolute inset-x-4 bottom-4 flex translate-y-2 items-center justify-center gap-2 rounded-full border border-white/20 bg-black/55 px-4 py-2.5 font-mono text-[12px] text-white opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            View case study <ArrowUpRight />
          </span>
        </Link>
      </motion.div>
    </motion.div>
  )
}

/** Home hero mosaic — CSS masonry, gentle scroll parallax, staggered tiles. */
export function HeroMosaic() {
  const ref = useRef<HTMLDivElement>(null)
  const ready = useIsMotionReady()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [50, -50])

  return (
    <div ref={ref} className="w-full max-w-[1200px]">
      <motion.div style={ready ? { y } : undefined} className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {TILES.map((tile, i) => (
          <Cell key={tile.href} tile={tile} i={i} />
        ))}
      </motion.div>
      <div className="mt-8 flex justify-center">
        <Link
          to="/work"
          className="group inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.1em] text-ink-faint transition-colors hover:text-ink"
        >
          See all 18 case studies <ArrowUpRight />
        </Link>
      </div>
    </div>
  )
}
