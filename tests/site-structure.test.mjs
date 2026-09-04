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

test('Photo Booth supports and uses a six-image gallery', () => {
  const data = readFileSync(new URL('../src/data.ts', import.meta.url), 'utf8')
  const photoBooth = data.slice(data.indexOf("name: 'Instax Photo Booth'"), data.indexOf("name: 'Caffeine Toggle'"))
  const shotsStart = photoBooth.indexOf('shots: [')
  const shots = photoBooth.slice(shotsStart, photoBooth.indexOf('],', shotsStart))
  assert.match(data, /shots\?: string\[\]/)
  assert.equal((shots.match(/'\/shots\/photobooth-/g) ?? []).length, 6)
  assert.match(app, /function ProjectCard[\s\S]*useState/)
})

test('Photo Booth leads with a downloadable schematic and action shortcut', () => {
  const data = readFileSync(new URL('../src/data.ts', import.meta.url), 'utf8')
  const photoBooth = data.slice(data.indexOf("name: 'Instax Photo Booth'"), data.indexOf("name: 'Caffeine Toggle'"))
  assert.match(data, /schematic\?: string/)
  assert.match(data, /actionShot\?: string/)
  assert.match(photoBooth, /schematic: '\/shots\/photobooth-schematic\.png'/)
  assert.match(photoBooth, /actionShot: '\/shots\/photobooth-action\.jpg'/)
  assert.match(photoBooth, /shots:\s*\[\s*'\/shots\/photobooth-schematic\.png',\s*'\/shots\/photobooth-action\.jpg'/)
  assert.match(app, /download="Instax-Photo-Booth-Schematic\.png"/)
  assert.match(app, /Download schematic/)
  assert.match(app, /See it in action/)
})

test('Photo Booth caption matches the documented build schematic', () => {
  const data = readFileSync(new URL('../src/data.ts', import.meta.url), 'utf8')
  const photoBooth = data.slice(data.indexOf("name: 'Instax Photo Booth'"), data.indexOf("name: 'Caffeine Toggle'"))
  assert.match(photoBooth, /Raspberry Pi 4/)
  assert.match(photoBooth, /7-inch touch display/)
  assert.match(photoBooth, /12 MP Camera Module 3 NoIR/)
  assert.match(photoBooth, /hollow book/)
  assert.match(photoBooth, /Instax Mini Link/)
  assert.match(photoBooth, /Bluetooth/)
  assert.match(photoBooth, /no laptop or internet/)
})

test('DormView is marked still tweaking', () => {
  const data = readFileSync(new URL('../src/data.ts', import.meta.url), 'utf8')
  const dormView = data.slice(data.indexOf("name: 'DormView'"), data.indexOf("name: 'Forkcast'"))
  assert.match(dormView, /status: 'still tweaking'/)
})

test('Resume renders the current one-page preview', () => {
  const resume = app.slice(app.indexOf('function Resume()'), app.indexOf('/* ---------------- APP ---------------- */'))
  assert.match(resume, /src="\/resume-p1\.jpg"/)
  assert.doesNotMatch(resume, /resume-p2\.jpg/)
  assert.equal((resume.match(/Kimi Yashar resume, page \d/g) ?? []).length, 1, 'expected one image with matching alt text')
})
