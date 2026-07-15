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

function Nav({ page, go }: { page: Page; go: (p: Page) => void }) {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 sm:px-6 md:px-10 lg:px-14 py-4">
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
        href={`mailto:${CONTACT.email}`}
        className="liquid-glass hidden sm:flex rounded-full px-5 py-2.5 text-[13px] text-white/90 hover:text-white transition-colors items-center gap-1.5"
      >
        Say Hello <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} />
      </a>
    </nav>
  )
}

/* ---------------- HOME ---------------- */

function Home({ go }: { go: (p: Page) => void }) {
  return (
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
              <div className="text-3xl md:text-4xl font-light tracking-tight">{PROJECTS.length}</div>
              <div className="text-white/70 text-[13px] mt-1">
                things I've built, from dorm rooms to orbit
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
            src="/shots/discovery-day.jpg"
            alt="Discovery Day"
            className="absolute inset-0 h-full w-full object-cover opacity-50 group-hover:opacity-65 group-hover:scale-[1.02] transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40" />
          <div className="relative z-10 h-full flex flex-col p-5 md:p-6">
            <SectionLabel text="Community" align="start" />
            <div className="mt-auto">
              <div className="text-xl md:text-2xl font-light tracking-tight leading-snug">
                Free science labs for kids
              </div>
              <div className="text-white/70 text-[13px] mt-1">
                Discovery Day, Community Tables, and more
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Reach me row */}
      <div className="mt-4 md:mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        <div className="rounded-2xl noise-overlay p-5 md:p-6 md:col-span-2 relative" style={{ background: '#324444' }}>
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
          Scroll down through the causes <ChevronDown className="h-4 w-4 text-white/40" strokeWidth={1.5} />
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
          <p className="mt-3 text-sm md:text-[15px] text-white/60">Last updated July 2026</p>
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
