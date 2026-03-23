#!/usr/bin/env node
/**
 * audit-animations.ts
 * Scans src/ for animation violations. Exits non-zero if CRITICAL findings exist.
 */
import { readdirSync, readFileSync, statSync } from 'fs'
import { join, extname } from 'path'

interface Finding {
  severity: 'CRITICAL' | 'WARN' | 'INFO'
  rule: string
  message: string
  file: string
  line: number
}

const findings: Finding[] = []
const root = join(process.cwd(), 'src')

function scanDir(dir: string) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) {
      scanDir(full)
    } else if (['.ts', '.tsx'].includes(extname(entry))) {
      scanFile(full)
    }
  }
}

function scanFile(filePath: string) {
  const content = readFileSync(filePath, 'utf8')
  const lines = content.split('\n')
  const rel = filePath.replace(process.cwd() + '/', '')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const lineNum = i + 1

    // CRITICAL: Non-composited properties
    if (/animate=\{.*\b(width|height|top|left)\b/.test(line) ||
        /\b(width|height|top|left)\s*:\s*[\d"']/.test(line) && /animate/.test(content.slice(0, content.indexOf(line)))) {
      findings.push({
        severity: 'CRITICAL',
        rule: 'non-composited-prop',
        message: `Animating non-composited property. Use transform instead.`,
        file: rel,
        line: lineNum,
      })
    }

    // CRITICAL: Missing useReducedMotion in hooks
    if (filePath.includes('/hooks/') && /^export function use/.test(line)) {
      const fnBody = lines.slice(i, i + 5).join('\n')
      if (!fnBody.includes('useReducedMotion')) {
        findings.push({
          severity: 'CRITICAL',
          rule: 'missing-reduced-motion',
          message: `Animation hook does not call useReducedMotion() as first line.`,
          file: rel,
          line: lineNum,
        })
      }
    }

    // WARN: Inline transition strings
    if (/transition:\s*['"`]/.test(line)) {
      findings.push({
        severity: 'WARN',
        rule: 'inline-transition-string',
        message: `Hardcoded transition string found. Use named presets from motion.config.`,
        file: rel,
        line: lineNum,
      })
    }

    // WARN: Long duration
    const durationMatch = /duration:\s*([\d.]+)/.exec(line)
    if (durationMatch && parseFloat(durationMatch[1]) > 0.6) {
      findings.push({
        severity: 'WARN',
        rule: 'long-duration',
        message: `Animation duration ${durationMatch[1]}s exceeds 600ms threshold.`,
        file: rel,
        line: lineNum,
      })
    }

    // CRITICAL: Raw style transition in components
    if (/style=\{\{[^}]*transition/.test(line)) {
      findings.push({
        severity: 'CRITICAL',
        rule: 'raw-style-transition',
        message: `Raw style={{ transition }} detected. All motion must use animations/ imports.`,
        file: rel,
        line: lineNum,
      })
    }
  }
}

scanDir(root)

const report = {
  findings,
  summary: {
    CRITICAL: findings.filter(f => f.severity === 'CRITICAL').length,
    WARN: findings.filter(f => f.severity === 'WARN').length,
    INFO: findings.filter(f => f.severity === 'INFO').length,
  },
  approved: findings.filter(f => f.severity === 'CRITICAL').length === 0,
}

console.log(JSON.stringify(report, null, 2))

if (report.summary.CRITICAL > 0) {
  console.error(`\nAudit FAILED: ${report.summary.CRITICAL} CRITICAL finding(s)`)
  process.exit(1)
}

console.log(`\nAudit PASSED: 0 CRITICAL findings`)
