import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import type { Plugin } from 'vite'

function devApiPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'dev-api-stream',
    configureServer(server) {
      server.middlewares.use('/api/stream', async (req, res, next) => {
        if (req.method !== 'POST') { next(); return }

        const body = await new Promise<string>((resolve) => {
          let data = ''
          req.on('data', (chunk: Buffer) => { data += chunk })
          req.on('end', () => resolve(data))
        })

        const { model, system, messages, max_tokens } = JSON.parse(body)
        const apiKey = env.ANTHROPIC_API_KEY

        if (!apiKey) {
          res.statusCode = 500
          res.end('ANTHROPIC_API_KEY not configured')
          return
        }

        res.setHeader('Content-Type', 'text/event-stream')
        res.setHeader('Cache-Control', 'no-cache')
        res.setHeader('Connection', 'keep-alive')

        try {
          const { default: Anthropic } = await import('@anthropic-ai/sdk')
          const client = new Anthropic({ apiKey })
          const stream = client.messages.stream({ model, system, messages, max_tokens })

          for await (const event of stream) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              res.write(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`)
            }
          }

          res.write('data: [DONE]\n\n')
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err)
          res.write(`data: ${JSON.stringify({ error: message })}\n\n`)
        }

        res.end()
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), devApiPlugin(env)],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id: string) => {
            if (id.includes('three') || id.includes('@react-three')) return 'three'
            if (id.includes('gsap')) return 'gsap'
            if (id.includes('framer-motion')) return 'framer'
            if (id.includes('react') || id.includes('zustand')) return 'vendor'
          },
        },
      },
    },
  }
})
