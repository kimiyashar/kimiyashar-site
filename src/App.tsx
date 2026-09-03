import { useEffect, useRef, useState } from 'react'
import {
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  Sparkle,
  Code2,
  Briefcase,
  Mail,
  Download,
  ChevronDown,
} from 'lucide-react'
import { PROJECTS, COMMUNITY, NOW, CONTACT } from './data'
import type { Project } from './data'

type Page = 'home' | 'projects' | 'community' | 'resume'

const PAGES: { id: Page; label: string; short: string }[] = [
  { id: 'home', label: 'Home', short: 'Home' },
  { id: 'projects', label: 'AI Projects', short: 'Projects' },
  { id: 'community', label: 'Community', short: 'Community' },
  { id: 'resume', label: 'Resume', short: 'Resume' },
]

function usePage(): [Page, (p: Page) => void] {
  const read = (): Page => {
    const h = window.location.hash.replace('#/', '').replace('#', '')
    return (PAGES.some((p) => p.id === h) ? h : 'home') as Page
  }
  const [page, setPage] = useState<Page>(read)
  useEffect(() => {
    const onHash = () => setPage(read())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  const go = (p: Page) => {
    window.location.hash = `/${p}`
  }
  return [page, go]
}

function SectionLabel({ text, align = 'center' }: { text: string; align?: 'center' | 'start' }) {
  return (
    <div className={`flex items-center gap-2 ${align === 'center' ? 'justify-center' : 'justify-start'}`}>
      <Sparkle className="h-3 w-3 text-white/70" strokeWidth={1.5} />
      <span className="uppercase tracking-[0.22em] text-[11px] text-white/70">{text}</span>
      <Sparkle className="h-3 w-3 text-white/70" strokeWidth={1.5} />
    </div>
  )
}

// every page scrolls under the fixed nav, so the scrim is global, not Home-only
function useNavScrim() {
  useEffect(() => {
    const root = document.documentElement
    let raf = 0
    const update = () => {
      raf = 0
      root.style.setProperty('--nav-s', Math.min(1, window.scrollY / 80).toFixed(3))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
      root.style.removeProperty('--nav-s')
    }
  }, [])
}

function Nav({ page, go }: { page: Page; go: (p: Page) => void }) {
  useNavScrim()
  return (
    <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 sm:px-6 md:px-10 lg:px-14 py-4">
      <div className="nav-scrim pointer-events-none absolute inset-x-0 top-0 h-24 -z-10" aria-hidden="true" />
      <button
        onClick={() => go('home')}
        className="hidden md:block text-[15px] tracking-tight text-white/90 hover:text-white transition-colors"
      >
        kimi yashar
      </button>
      <div className="liquid-glass rounded-full flex items-center gap-0.5 sm:gap-1 p-1 mx-auto md:mx-0">
        {PAGES.map((p) => (
          <button
            key={p.id}
            onClick={() => go(p.id)}
            className={`rounded-full px-2.5 sm:px-4 py-1.5 text-[12px] sm:text-[13px] whitespace-nowrap transition-colors ${
              page === p.id ? 'bg-white text-black' : 'text-white/70 hover:text-white'
            }`}
          >
            <span className="sm:hidden">{p.short}</span>
            <span className="hidden sm:inline">{p.label}</span>
          </button>
        ))}
      </div>
      <a
        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${CONTACT.email}&su=${encodeURIComponent('Hi Kimi!')}`}
        target="_blank"
        rel="noreferrer"
        className="liquid-glass hidden sm:flex rounded-full px-5 py-2.5 text-[13px] text-white/90 hover:text-white transition-colors items-center gap-1.5"
      >
        Say Hello <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
      </a>
    </nav>
  )
}

/* ---------------- HOME ---------------- */

/* Both numbers below are read off each frame's own instrument data bar.
   Wide field: aftercycling9.tiff, 990x, FW 525 um, BSD 15 kV, 2026-07-29.
   Detail:     aftercycling5.tiff, 7300x, FW 70.9 um, BSD 15 kV, 2026-07-29.
   The marker box is sized from those two field widths, so it covers the true
   fraction of the wide field that the detail actually represents: 13.5%. */
const SEM_PLATE_W = 2200
const SEM_PLATE_H = 1277
const SEM_PLATE_FW = 525      // um across the wide field
const SEM_DETAIL_FW = 70.9    // um across the detail frame
const SEM_DETAIL_ASPECT = 1600 / 1000
// candidate wide-field bar lengths, longest first — the first one that fits wins
const SEM_BAR_LADDER = [200, 100, 50, 20, 10]

// where on the wide plate the detail is called out from, as a fraction of the image
const SEM_ANCHOR_U = 0.44
const SEM_ANCHOR_V = 0.52

function useSemScroll() {
  useEffect(() => {
    const root = document.documentElement
    root.dataset.sem = 'on'
    let raf = 0
    const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

    const svg = () => document.querySelector<SVGSVGElement>('.sem-leader')
    const update = () => {
      raf = 0
      const max = root.scrollHeight - window.innerHeight
      const p = max > 8 ? clamp01(window.scrollY / max) : 0
      root.style.setProperty('--sem-p', p.toFixed(4))

      // caption reveals off the stage's own entry, not page scroll, so the fade
      // lands on screen instead of below the fold — full at the moment it pins
      const stage = document.querySelector('.sem-stage')
      const vw = window.innerWidth
      const vh = window.innerHeight
      const entry = stage ? (vh - stage.getBoundingClientRect().top) / vh : 0
      const c = clamp01((entry - 0.72) / 0.34)
      // the callout leads the caption so the box lands, the arrow draws, then the words
      const r = clamp01((entry - 0.50) / 0.34)
      root.style.setProperty('--sem-c', c.toFixed(4))
      root.style.setProperty('--sem-r', r.toFixed(4))

      // --- track the called-out region through the zoom -------------------
      // 1. replicate `background-size: cover; background-position: left bottom`
      const cover = Math.max(vw / SEM_PLATE_W, vh / SEM_PLATE_H)
      const rw = SEM_PLATE_W * cover
      const rh = SEM_PLATE_H * cover
      // narrow desktops leave less room between the marker and the plate, so the
      // callout walks left as the viewport tightens instead of crowding the box
      const slack = clamp01((vw - 1000) / 400)
      const anchorU = 0.34 + (SEM_ANCHOR_U - 0.34) * slack
      const bx = anchorU * rw                 // left-anchored
      const by = vh - rh + SEM_ANCHOR_V * rh  // bottom-anchored
      // 2. replicate `transform: scale(s)` about `transform-origin: 30% 66%`
      const s = 1 + 0.48 * p
      const ox = 0.30 * vw
      const oy = 0.66 * vh
      const mx = ox + (bx - ox) * s
      const my = oy + (by - oy) * s
      // 3. marker covers the true field fraction, and zooms with the specimen
      const mw = (SEM_DETAIL_FW / SEM_PLATE_FW) * rw * s
      const mh = (mw / SEM_DETAIL_ASPECT)

      // wide-field scale bar: same rendered-plate basis as the marker. A fixed
      // length would overflow its panel on very large displays and get clamped by
      // max-width — a bar that reads 50 um while being drawn short is a lie — so
      // step down a ladder to the longest round value that still fits.
      const pxPerUm = (rw * s) / SEM_PLATE_FW
      const um = SEM_BAR_LADDER.find((u) => u * pxPerUm <= 170) ?? SEM_BAR_LADDER[SEM_BAR_LADDER.length - 1]
      root.style.setProperty('--sem-bar', `${(um * pxPerUm).toFixed(1)}px`)
      // two bars can be mounted (card + specimen); the variant switch decides
      // which is visible, so label both rather than only the first match
      const barText = `${um} µm`
      document.querySelectorAll('.sem-fieldbar em').forEach((el) => {
        if (el.textContent !== barText) el.textContent = barText
      })

      const el = svg()
      const box = document.querySelector<HTMLElement>('.sem-inset')
      if (!el || !box) return
      el.setAttribute('viewBox', `0 0 ${vw} ${vh}`)
      const rect = el.querySelector('.sem-marker') as SVGRectElement | null
      if (rect) {
        rect.setAttribute('x', String(mx - mw / 2))
        rect.setAttribute('y', String(my - mh / 2))
        rect.setAttribute('width', String(mw))
        rect.setAttribute('height', String(mh))
      }

      // leader runs from the inset box's nearest edge to the marker
      const b = box.getBoundingClientRect()
      const cxb = b.left + b.width / 2
      const cyb = b.top + b.height / 2
      let dx = mx - cxb
      let dy = my - cyb
      const len = Math.hypot(dx, dy) || 1
      dx /= len; dy /= len
      // exit point on the box perimeter, then stop short of the marker edge
      const tx = Math.abs(dx) > 1e-6 ? (b.width / 2 + 8) / Math.abs(dx) : Infinity
      const ty = Math.abs(dy) > 1e-6 ? (b.height / 2 + 8) / Math.abs(dy) : Infinity
      const t = Math.min(tx, ty)
      const x1 = cxb + dx * t
      const y1 = cyb + dy * t
      const stop = Math.max(mw, mh) / 2 + 7
      const x2 = mx - dx * stop
      const y2 = my - dy * stop

      const line = el.querySelector('.sem-leader-line') as SVGLineElement | null
      if (line) {
        line.setAttribute('x1', String(x1)); line.setAttribute('y1', String(y1))
        line.setAttribute('x2', String(x2)); line.setAttribute('y2', String(y2))
        const L = Math.hypot(x2 - x1, y2 - y1)
        const draw = clamp01((r - 0.30) / 0.45)
        line.style.strokeDasharray = String(L)
        line.style.strokeDashoffset = String(L * (1 - draw))
      }
      const head = el.querySelector('.sem-leader-head') as SVGPolygonElement | null
      if (head) {
        const a = 9, wdt = 5
        const px = -dy, py = dx  // perpendicular
        head.setAttribute('points', [
          `${x2 + dx * a},${y2 + dy * a}`,
          `${x2 + px * wdt},${y2 + py * wdt}`,
          `${x2 - px * wdt},${y2 - py * wdt}`,
        ].join(' '))
        head.style.opacity = String(clamp01((r - 0.68) / 0.18))
      }
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
      root.style.removeProperty('--sem-p')
      root.style.removeProperty('--sem-r')
      delete root.dataset.sem
    }
  }, [])
}

function Home({ go }: { go: (p: Page) => void }) {
  useSemScroll()
  return (
    <>
    <main className="min-h-screen px-4 sm:px-6 md:px-10 lg:px-14 pt-24 pb-10 flex flex-col">
      <div className="max-w-3xl fade-up">
        <h1 className="text-[28px] sm:text-3xl md:text-4xl lg:text-[44px] leading-[1.15] font-normal tracking-tight">
          Hi, I'm Kimi!
        </h1>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 flex-1">
        {/* Now building */}
        <div className="fade-up fade-up-1 rounded-2xl noise-overlay p-5 md:p-6 flex flex-col" style={{ background: '#324444' }}>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-300 pulse-dot" />
            <span className="uppercase tracking-[0.22em] text-[11px] text-white/70">Now building</span>
          </div>
          <ul className="mt-5 space-y-4 relative z-10">
            {NOW.map((n) => (
              <li key={n.label} className="grid grid-cols-[auto_auto_1fr] items-baseline gap-x-2 text-[13.5px] leading-[1.6]">
                <span className="text-white/90">{n.label}</span>
                <Sparkle className="h-3 w-3 text-white/50 self-center" strokeWidth={1.5} />
                <span className="text-white/60">{n.detail}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => go('projects')}
            className="relative z-10 mt-auto pt-6 flex items-center gap-1.5 text-[13px] text-white/80 hover:text-white transition-colors"
          >
            See all the projects <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Projects teaser */}
        <button
          onClick={() => go('projects')}
          className="fade-up fade-up-2 group rounded-2xl bg-black relative overflow-hidden text-left min-h-[260px]"
        >
          <img
            src="/shots/dormview.jpg"
            alt="DormView"
            className="absolute inset-0 h-full w-full object-cover opacity-50 group-hover:opacity-65 group-hover:scale-[1.02] transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40" />
          <div className="relative z-10 h-full flex flex-col p-5 md:p-6">
            <SectionLabel text="AI Projects" align="start" />
            <div className="mt-auto">
              <div className="text-xl md:text-2xl font-light tracking-tight leading-snug">
                AI Projects
              </div>
              <div className="text-white/70 text-[13px] mt-1">
                that I built, and now use everyday
              </div>
            </div>
          </div>
        </button>

        {/* Community teaser */}
        <button
          onClick={() => go('community')}
          className="fade-up fade-up-3 group rounded-2xl bg-black relative overflow-hidden text-left min-h-[260px]"
        >
          <img
            src="/shots/offline.jpg"
            alt="Kimi teaching a Discovery Day science lesson"
            className="absolute inset-0 h-full w-full object-cover object-[50%_62%] opacity-50 group-hover:opacity-65 group-hover:scale-[1.02] transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40" />
          <div className="relative z-10 h-full flex flex-col p-5 md:p-6">
            <SectionLabel text="Community" align="start" />
            <div className="mt-auto">
              <div className="text-xl md:text-2xl font-light tracking-tight leading-snug">
                Off-line projects
              </div>
              <div className="text-white/70 text-[13px] mt-1">
                volunteering and teaching
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Reach me row */}
      <div className="mt-4 md:mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        <div id="reach-me" className="scroll-mt-24 rounded-2xl noise-overlay p-5 md:p-6 md:col-span-2 relative" style={{ background: '#324444' }}>
          <SectionLabel text="Reach me" align="start" />
          <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:gap-8 relative z-10">
            <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 text-[13.5px] text-white/85 hover:text-white transition-colors">
              <Mail className="h-4 w-4" strokeWidth={1.5} /> {CONTACT.email}
            </a>
            <a href={CONTACT.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[13.5px] text-white/85 hover:text-white transition-colors">
              <Code2 className="h-4 w-4" strokeWidth={1.5} /> github.com/{CONTACT.githubHandle}
            </a>
            <a href={CONTACT.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[13.5px] text-white/85 hover:text-white transition-colors">
              <Briefcase className="h-4 w-4" strokeWidth={1.5} /> LinkedIn
            </a>
          </div>
          <a
            href={`mailto:${CONTACT.email}`}
            className="liquid-glass absolute top-4 right-4 h-9 w-9 rounded-full flex items-center justify-center text-white/85 hover:text-white z-10"
          >
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
          </a>
        </div>
        <button onClick={() => go('resume')} className="liquid-glass rounded-2xl p-5 md:p-6 text-left group">
          <SectionLabel text="Resume" align="start" />
          <div className="mt-3 flex items-center justify-between relative z-10">
            <span className="text-[13.5px] text-white/70 group-hover:text-white transition-colors">
              View or download the PDF
            </span>
            <ArrowUpRight className="h-4 w-4 text-white/60 group-hover:text-white transition-colors" strokeWidth={1.5} />
          </div>
        </button>
      </div>
    </main>

    {/* SEM specimen reveal — scroll room that the background zooms into */}
    <section className="sem-stage relative h-[140vh]">
      {/* sticky so the caption holds on screen while the zoom finishes behind it */}
      <div className="sticky top-0 h-screen px-4 sm:px-6 md:px-10 lg:px-14">

        {/* leader: marks the called-out region on the wide field, points to the detail */}
        <svg className="sem-leader" preserveAspectRatio="none" aria-hidden="true">
          <rect className="sem-marker" x="0" y="0" width="0" height="0" rx="2" />
          <line className="sem-leader-line" x1="0" y1="0" x2="0" y2="0" />
          <polygon className="sem-leader-head" points="0,0 0,0 0,0" />
        </svg>

        {/* detail plate — full quality, unfaded, deliberately sharper than the field */}
        <figure className="sem-inset m-0">
          <div className="sem-inset-frame">
            <img
              src="/sem/inset-7300x.jpg"
              alt="Anti-reflective pyramid surface texture etched into the silicon wafer, at 7,300x magnification"
            />
            <span className="sem-scalebar"><i /><em>20&nbsp;&micro;m</em></span>
          </div>
          <div className="sem-inset-text">
            <figcaption className="sem-inset-cap">
              Anti-reflective pyramid surface texture etched into the silicon wafer,
              shown at <span className="whitespace-nowrap">7,300&times;</span> magnification
              and imaged via SEM at SLAC National Accelerator Laboratory.
            </figcaption>
          </div>
        </figure>

        {/* the scale bar rides on the micrograph itself, the way the
            detail plate does — a bar inside a floating card appears to measure
            the card, not the specimen behind it */}
        <span className="sem-fieldbar sem-fieldbar--stage"><i /><em>50&nbsp;&micro;m</em></span>

        <div className="absolute inset-x-0 bottom-0 flex items-end px-4 sm:px-6 md:px-10 lg:px-14 pb-[12vh]">
          <figure className="sem-caption max-w-lg m-0 p-5 md:p-6">
            <figcaption className="text-white/[0.78] text-[13.5px] leading-[1.65] font-light">
              Single-crystal silicon wafer at 990&times; magnification, etched
              overnight in 2&nbsp;M KOH and imaged via SEM at SLAC National
              Accelerator Laboratory.
            </figcaption>
            <div className="sem-meta">
              {/* the wide field has no burnt-in bar left after cropping, and it
                  zooms, so its scale bar is measured each frame from the plate
                  geometry — JS writes --sem-bar and this em's label */}
              <span className="sem-fieldbar sem-fieldbar--card"><i /><em>50&nbsp;&micro;m</em></span>
              {/* split so a narrow panel breaks between name and institution
                  instead of mid-way through "SLAC National Accelerator Laboratory" */}
              <span className="sem-credit">
                <b>Kimi Yashar</b>
                <s>/</s>
                <b>SLAC National Accelerator Laboratory</b>
              </span>
            </div>
          </figure>
        </div>
      </div>
    </section>
    </>
  )
}

/* ---------------- PROJECTS ---------------- */

function ProjectCard({ p }: { p: Project }) {
  return (
    <div
      className="relative shrink-0 w-[86vw] sm:w-[520px] md:w-[560px] rounded-2xl overflow-hidden noise-overlay flex flex-col"
      style={{ background: p.tint }}
    >
      <div className="relative h-52 sm:h-60 bg-black/40">
        {p.shot ? (
          <img src={p.shot} alt={p.name} className="absolute inset-0 h-full w-full object-cover object-top" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="uppercase tracking-[0.3em] text-[11px] text-white/40">in the oven</span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
          <div>
            <div className="text-lg tracking-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">{p.name}</div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/75 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">{p.tag}</div>
          </div>
          {p.status && (
            <span className="liquid-glass rounded-full px-3 py-1 text-[11px] text-amber-200/90">{p.status}</span>
          )}
        </div>
      </div>
      <div className="p-5 flex flex-col gap-2 flex-1 relative z-10">
        <p className="text-[13.5px] leading-[1.6] text-white/60">{p.problem}</p>
        <p className="text-[13.5px] leading-[1.6] text-white/90">{p.solution}</p>
        <div className="mt-auto pt-3">
          {p.link ? (
            <a
              href={p.link}
              target="_blank"
              rel="noreferrer"
              className="liquid-glass inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] text-white/90 hover:text-white transition-colors"
            >
              {p.linkLabel ?? 'Visit the site'} <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </a>
          ) : (
            <span className="inline-flex items-center gap-2 text-[13px] text-white/50">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-300/80 pulse-dot" /> in the process
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function Projects() {
  const ref = useRef<HTMLDivElement>(null)
  const scrollBy = (dir: 1 | -1) => {
    const el = ref.current
    if (!el) return
    el.scrollBy({ left: dir * (el.clientWidth * 0.7), behavior: 'smooth' })
  }
  return (
    <main className="min-h-screen pt-24 pb-10 flex flex-col">
      <div className="px-4 sm:px-6 md:px-10 lg:px-14 flex items-end justify-between fade-up">
        <div className="max-w-2xl">
          <SectionLabel text="AI Projects" align="start" />
          <h1 className="mt-3 text-[26px] sm:text-3xl md:text-4xl leading-[1.15] tracking-tight">
            Built with AI, shipped for real.
          </h1>
          <p className="mt-2 text-sm md:text-[15px] leading-[1.6] text-white/60">
            One problem, one solution, one link each. Scroll sideways.
          </p>
        </div>
        <div className="hidden sm:flex gap-2">
          <button onClick={() => scrollBy(-1)} className="liquid-glass h-10 w-10 rounded-full flex items-center justify-center text-white/80 hover:text-white">
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <button onClick={() => scrollBy(1)} className="liquid-glass h-10 w-10 rounded-full flex items-center justify-center text-white/80 hover:text-white">
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
      <div
        ref={ref}
        className="carousel-x fade-up fade-up-1 mt-8 flex gap-4 md:gap-5 overflow-x-auto px-4 sm:px-6 md:px-10 lg:px-14 pb-4 flex-1 items-stretch"
      >
        {PROJECTS.map((p) => (
          <ProjectCard key={p.name} p={p} />
        ))}
        <div className="shrink-0 w-1" />
      </div>
    </main>
  )
}

/* ---------------- COMMUNITY ---------------- */

function Community() {
  return (
    <main className="h-screen pt-20 flex flex-col">
      <div className="px-4 sm:px-6 md:px-10 lg:px-14 pb-4 fade-up">
        <SectionLabel text="Community" align="start" />
        <h1 className="mt-3 text-[26px] sm:text-3xl md:text-4xl leading-[1.15] tracking-tight">
          Off-line projects.
        </h1>
        <p className="mt-2 text-sm md:text-[15px] leading-[1.6] text-white/60 flex items-center gap-2">
          volunteering and teaching <ChevronDown className="h-4 w-4 text-white/40" strokeWidth={1.5} />
        </p>
      </div>
      <div className="carousel-y flex-1 overflow-y-auto px-4 sm:px-6 md:px-10 lg:px-14 pb-6 space-y-5">
        {COMMUNITY.map((c) => (
          <div
            key={c.name}
            className="relative rounded-2xl overflow-hidden noise-overlay min-h-[62vh] flex flex-col md:flex-row"
            style={{ background: c.tint }}
          >
            <div className="relative md:w-3/5 h-56 md:h-auto bg-black/40">
              {c.shot ? (
                <img src={c.shot} alt={c.name} className="absolute inset-0 h-full w-full object-cover object-top" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="uppercase tracking-[0.3em] text-[11px] text-white/40">photo coming soon</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/40" />
            </div>
            <div className="relative z-10 md:w-2/5 p-6 md:p-8 flex flex-col">
              <div className="text-[11px] uppercase tracking-[0.18em] text-white/60">{c.role}</div>
              <h2 className="mt-2 text-2xl md:text-3xl tracking-tight">{c.name}</h2>
              <p className="mt-4 text-[13.5px] md:text-sm leading-[1.7] text-white/80">{c.blurb}</p>
              <div className="mt-auto pt-6">
                {c.link ? (
                  <a
                    href={c.link}
                    target="_blank"
                    rel="noreferrer"
                    className="liquid-glass inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[13px] text-white/90 hover:text-white transition-colors"
                  >
                    Visit the site <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-2 text-[13px] text-white/50">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-300/80 pulse-dot" /> link coming soon
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

/* ---------------- RESUME ---------------- */

function Resume() {
  return (
    <main className="h-screen pt-20 flex flex-col px-4 sm:px-6 md:px-10 lg:px-14 pb-6">
      <div className="flex items-end justify-between pb-4 fade-up">
        <div>
          <SectionLabel text="Resume" align="start" />
          <p className="mt-3 text-sm md:text-[15px] text-white/60">Last updated September 2026</p>
        </div>
        <div className="flex gap-2">
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="liquid-glass inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] text-white/90 hover:text-white transition-colors"
          >
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} /> Open PDF
          </a>
          <a
            href="/resume.pdf"
            download="Kimi Yashar - Resume.pdf"
            className="liquid-glass inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] text-white/90 hover:text-white transition-colors"
          >
            <Download className="h-4 w-4" strokeWidth={1.5} /> Download
          </a>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto fade-up fade-up-1">
        <a href="/resume.pdf" target="_blank" rel="noreferrer" className="block max-w-3xl mx-auto space-y-5 pb-2">
          <img
            src="/resume-p1.jpg"
            alt="Kimi Yashar resume, page 1. Click to open the full PDF."
            className="w-full rounded-2xl shadow-2xl shadow-black/60 hover:opacity-95 transition-opacity"
          />
          <img
            src="/resume-p2.jpg"
            alt="Kimi Yashar resume, page 2. Click to open the full PDF."
            className="w-full rounded-2xl shadow-2xl shadow-black/60 hover:opacity-95 transition-opacity"
          />
        </a>
      </div>
    </main>
  )
}

/* ---------------- APP ---------------- */

export default function App() {
  const [page, go] = usePage()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [page])
  return (
    <div className="min-h-screen text-white">
      <Nav page={page} go={go} />
      {page === 'home' && <Home go={go} />}
      {page === 'projects' && <Projects />}
      {page === 'community' && <Community />}
      {page === 'resume' && <Resume />}
    </div>
  )
}
