import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const app = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8')

test('the SEM scroll reveal is mounted once at app level for every route', () => {
  const appComponent = app.slice(app.indexOf('export default function App()'))
  assert.match(app, /function SemReveal\(\)/, 'expected a reusable SemReveal component')
  assert.match(appComponent, /<SemReveal\s*\/>/, 'expected App to mount SemReveal after the active page')
  assert.equal((appComponent.match(/<SemReveal\s*\/>/g) ?? []).length, 1)
})

test('the top-left brand uses title case', () => {
  assert.match(app, />\s*Kimi Yashar\s*<\/button>/)
  assert.doesNotMatch(app, />\s*kimi yashar\s*<\/button>/)
})

test('Projects uses the requested label and intro copy', () => {
  assert.match(app, /label: 'Projects'/)
  assert.match(app, /<SectionLabel text="Projects"/)
  assert.match(app, /Cool things I wanted\./)
  assert.match(app, /All projects were started during summer 2026 or later\./)
  assert.doesNotMatch(app, /AI Projects/)
  assert.doesNotMatch(app, /Built with AI, shipped for real\./)
})

test('Photo Booth supports and uses a four-photo gallery', () => {
  const data = readFileSync(new URL('../src/data.ts', import.meta.url), 'utf8')
  assert.match(data, /shots\?: string\[\]/)
  assert.match(data, /shots:\s*\[([\s\S]*?photobooth-[\s\S]*?){4}\]/)
  assert.match(app, /function ProjectCard[\s\S]*useState/)
})

test('DormView is marked still tweaking', () => {
  const data = readFileSync(new URL('../src/data.ts', import.meta.url), 'utf8')
  const dormView = data.slice(data.indexOf("name: 'DormView'"), data.indexOf("name: 'Forkcast'"))
  assert.match(dormView, /status: 'still tweaking'/)
})
