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
