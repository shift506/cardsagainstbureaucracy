#!/usr/bin/env node
/**
 * notify-slack.ts
 * Args: --channel <channel> --message <message> --level info|warn|error
 */
const args = process.argv.slice(2)

function getArg(flag: string): string {
  const idx = args.indexOf(flag)
  return idx !== -1 ? args[idx + 1] : ''
}

const channel = getArg('--channel')
const message = getArg('--message')
const level = getArg('--level') as 'info' | 'warn' | 'error'
const webhookUrl = process.env.SLACK_WEBHOOK_URL

if (!webhookUrl) {
  console.error('SLACK_WEBHOOK_URL environment variable not set')
  process.exit(1)
}

const colorMap = { info: '#36a64f', warn: '#ffa500', error: '#ff0000' }

async function notify() {
  const payload = {
    channel: `#${channel}`,
    attachments: [{
      color: colorMap[level] ?? colorMap.info,
      text: message,
      footer: 'my-animation-app CI/CD',
      ts: Math.floor(Date.now() / 1000),
    }],
  }

  const res = await fetch(webhookUrl!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    console.error(`Slack notification failed: ${res.status}`)
    process.exit(1)
  }

  console.log(`Notified #${channel}`)
}

notify().catch(console.error)
