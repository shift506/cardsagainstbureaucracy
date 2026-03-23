#!/usr/bin/env node
/**
 * bump-version.ts
 * Args: --type patch|minor|major
 * Updates package.json version, creates git tag, updates CHANGELOG.md header.
 */
import { readFileSync, writeFileSync } from 'fs'
import { execSync } from 'child_process'

const args = process.argv.slice(2)
const typeIdx = args.indexOf('--type')
const type = args[typeIdx + 1] as 'patch' | 'minor' | 'major'

if (!['patch', 'minor', 'major'].includes(type)) {
  console.error('Usage: bump-version.ts --type patch|minor|major')
  process.exit(1)
}

const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as { version: string; [key: string]: unknown }
const [major, minor, patch] = pkg.version.split('.').map(Number)

let newVersion: string
if (type === 'major') newVersion = `${major + 1}.0.0`
else if (type === 'minor') newVersion = `${major}.${minor + 1}.0`
else newVersion = `${major}.${minor}.${patch + 1}`

pkg.version = newVersion
writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n')
console.log(`Version bumped: ${pkg.version} -> ${newVersion}`)

// Update CHANGELOG.md header
const today = new Date().toISOString().split('T')[0]
const changelogEntry = `## [${newVersion}] - ${today}\n\n`
try {
  const existing = readFileSync('CHANGELOG.md', 'utf8')
  writeFileSync('CHANGELOG.md', changelogEntry + existing)
} catch {
  writeFileSync('CHANGELOG.md', `# Changelog\n\n${changelogEntry}`)
}

// Create git tag
execSync(`git add package.json CHANGELOG.md`)
execSync(`git commit -m "chore(release): bump version to v${newVersion}"`)
execSync(`git tag v${newVersion}`)
console.log(`Created tag v${newVersion}`)
