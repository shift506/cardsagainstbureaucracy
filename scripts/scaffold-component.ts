#!/usr/bin/env node
/**
 * scaffold-component.ts
 * Args: --name ComponentName [--canvas]
 * Creates: component, variant map, animation hook, unit test, e2e test
 */
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { resolve } from 'path'

const args = process.argv.slice(2)
const nameIdx = args.indexOf('--name')
const isCanvas = args.includes('--canvas')

if (nameIdx === -1 || !args[nameIdx + 1]) {
  console.error('Usage: scaffold-component.ts --name ComponentName [--canvas]')
  process.exit(1)
}

const Name = args[nameIdx + 1]
const name = Name[0].toLowerCase() + Name.slice(1)
const root = resolve(process.cwd())

function ensureDir(dir: string) {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
}

function write(path: string, content: string) {
  writeFileSync(path, content, 'utf8')
  console.log(`  created: ${path}`)
}

// Component
ensureDir(`${root}/src/components`)
write(`${root}/src/components/${Name}.tsx`, `import { m } from 'framer-motion'
import { use${Name}Animation } from '@/animations/hooks/use${Name}Animation'

interface ${Name}Props {
  children?: React.ReactNode
}

export function ${Name}({ children }: ${Name}Props) {
  const { variants, isReduced } = use${Name}Animation()

  return (
    <m.div
      variants={isReduced ? undefined : variants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </m.div>
  )
}
`)

// Variants
ensureDir(`${root}/src/animations/variants`)
write(`${root}/src/animations/variants/${name}Variants.ts`, `import type { Variants } from 'framer-motion'
import { springs } from '../motion.config'

export const ${name}Variants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: springs.default,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: springs.stiff,
  },
}
`)

// Hook
ensureDir(`${root}/src/animations/hooks`)
write(`${root}/src/animations/hooks/use${Name}Animation.ts`, `import { useReducedMotion } from './useReducedMotion'
import { ${name}Variants } from '../variants/${name}Variants'

export function use${Name}Animation() {
  const isReduced = useReducedMotion()
  return { variants: ${name}Variants, isReduced }
}
`)

// Unit test
ensureDir(`${root}/tests/unit`)
write(`${root}/tests/unit/${name}.test.ts`, `import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { ${Name} } from '@/components/${Name}'

describe('${Name}', () => {
  it('renders without crashing', () => {
    const { container } = render(<${Name}>Test</${Name}>)
    expect(container.firstChild).not.toBeNull()
  })
})
`)

// E2E test
ensureDir(`${root}/tests/e2e`)
write(`${root}/tests/e2e/${name}.spec.ts`, `import { test, expect } from '@playwright/test'

test('${Name} animation renders', async ({ page }) => {
  await page.goto('/')
  const el = page.locator('[data-testid="${name}"]')
  await expect(el).toBeVisible()
})

test('${Name} respects reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const el = page.locator('[data-testid="${name}"]')
  await expect(el).toBeVisible()
})
`)

if (isCanvas) {
  ensureDir(`${root}/src/animations/canvas`)
  write(`${root}/src/animations/canvas/${name}.ts`, `/**
 * ${Name} canvas scene — isolated lifecycle.
 * Exports only mount/unmount.
 */
let animId: number | null = null

export function mount(el: HTMLElement): void {
  const canvas = document.createElement('canvas')
  canvas.width = el.clientWidth
  canvas.height = el.clientHeight
  el.appendChild(canvas)
  const ctx = canvas.getContext('2d')

  const loop = () => {
    animId = requestAnimationFrame(loop)
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // ${Name} scene rendering goes here
  }
  loop()
}

export function unmount(): void {
  if (animId !== null) cancelAnimationFrame(animId)
  animId = null
}
`)
}

console.log(`\nDone: ${Name} scaffolded successfully`)
