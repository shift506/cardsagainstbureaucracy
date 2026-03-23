#!/usr/bin/env node
/**
 * generate-changelog.ts
 * Reads git log since last tag, calls Claude API to group commits, writes CHANGELOG.md.
 */
import { execSync } from 'child_process'
import { writeFileSync, readFileSync, existsSync } from 'fs'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

function getLastTag(): string {
  try {
    return execSync('git describe --tags --abbrev=0 HEAD^').toString().trim()
  } catch {
    return ''
  }
}

function getCommitsSinceTag(tag: string): string {
  const range = tag ? `${tag}..HEAD` : 'HEAD'
  return execSync(`git log ${range} --format="%H %s"`).toString().trim()
}

async function groupCommits(commits: string): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    system: `You group git commits into changelog sections.
Output markdown with these sections (omit empty sections):
## Features
## Bug Fixes
## Performance
## Breaking Changes
Each item: - <description> (<short-sha>)`,
    messages: [{ role: 'user', content: commits }],
  })

  return message.content[0].type === 'text' ? message.content[0].text : ''
}

async function main() {
  const lastTag = getLastTag()
  const commits = getCommitsSinceTag(lastTag)

  if (!commits) {
    console.log('No commits since last tag.')
    return
  }

  console.log(`Grouping ${commits.split('\n').length} commits...`)
  const grouped = await groupCommits(commits)

  const today = new Date().toISOString().split('T')[0]
  const entry = `## Unreleased - ${today}\n\n${grouped}\n\n`

  const existing = existsSync('CHANGELOG.md') ? readFileSync('CHANGELOG.md', 'utf8') : '# Changelog\n\n'
  writeFileSync('CHANGELOG.md', existing.replace('# Changelog\n\n', `# Changelog\n\n${entry}`))

  console.log('CHANGELOG.md updated')
  console.log(grouped)
}

main().catch(console.error)
