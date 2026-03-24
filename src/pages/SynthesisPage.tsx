import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/animations/hooks/useReducedMotion'
import { useSessionStore } from '@/store/sessionStore'
import { runSynthesis } from '@/agents/facilitator'
import { downloadSessionHTML } from '@/utils/generateSessionHTML'
import { renderInline } from '@/utils/renderMarkdown'
import styles from './SynthesisPage.module.css'

export function SynthesisPage() {
  const prefersReduced = useReducedMotion()
  const navigate = useNavigate()
  const hasStarted = useRef(false)

  const {
    challengeInput,
    selectedAgenda,
    drawnCards,
    personaResponses,
    synthesis,
    setSynthesis,
    setFacilitatorStreaming,
    isFacilitatorStreaming,
    reset,
  } = useSessionStore()

  useEffect(() => {
    if (!challengeInput) { navigate('/'); return }
    if (synthesis || hasStarted.current) return
    hasStarted.current = true

    setFacilitatorStreaming(true)

    let accumulated = ''

    runSynthesis(challengeInput, selectedAgenda, drawnCards, personaResponses, {
      onChunk: (_personaId, chunk) => {
        accumulated += chunk
        setSynthesis(accumulated)
      },
      onComplete: () => {
        setFacilitatorStreaming(false)
      },
      onError: (_personaId, error) => {
        console.error('Synthesis error:', error)
        setFacilitatorStreaming(false)
      },
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleNewSession() {
    reset()
    navigate('/')
  }

  function handleDownload() {
    if (!challengeInput || !synthesis) return
    downloadSessionHTML(challengeInput, selectedAgenda, drawnCards, personaResponses, synthesis)
  }

  const sections = parseSynthesis(synthesis ?? '')

  return (
    <div className={styles.page}>
      <motion.div
        className={styles.container}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: prefersReduced ? 0 : 0.5 }}
      >
        <div className={styles.header}>
          <span className="subheading" style={{ color: 'var(--color-new-leaf)', fontSize: '0.7rem' }}>
            Phase 5 — Synthesis
          </span>
          <h1 className={styles.title}>The Lead's Synthesis</h1>
          {challengeInput && (
            <p className={styles.challenge}>{challengeInput.name}</p>
          )}
        </div>

        {isFacilitatorStreaming && !synthesis && (
          <div className={styles.loading}>
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </div>
        )}

        {synthesis && (
          <motion.div
            className={styles.synthesisOutput}
            initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {sections.length > 0 ? (
              sections.map((section, i) => (
                <div key={i} className={styles.section}>
                  {section.heading && (
                    <h2 className={styles.sectionHeading}>{section.heading}</h2>
                  )}
                  <div className={styles.sectionBody}>
                    {section.lines.map((line, j) => (
                      <p
                        key={j}
                        className={line.startsWith('-') || /^\d+\./.test(line) ? styles.listItem : styles.paragraph}
                        dangerouslySetInnerHTML={{ __html: renderInline(line.replace(/^[-\d.]+\s*/, '')) }}
                      />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.raw}>
                {synthesis}
                {isFacilitatorStreaming && <span className={styles.cursor}>▋</span>}
              </p>
            )}
          </motion.div>
        )}

        {!isFacilitatorStreaming && synthesis && (
          <motion.div
            className={styles.actions}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              className={styles.secondaryButton}
              onClick={() => navigate('/session/deliberation')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ← Back to Deliberation
            </motion.button>
            <motion.button
              className={styles.downloadButton}
              onClick={handleDownload}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ↓ Download Summary
            </motion.button>
            <motion.button
              className={styles.primaryButton}
              onClick={handleNewSession}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              New Session
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

interface ParsedSection {
  heading: string | null
  lines: string[]
}

function parseSynthesis(text: string): ParsedSection[] {
  if (!text.trim()) return []
  const sections: ParsedSection[] = []
  let current: ParsedSection = { heading: null, lines: [] }

  for (const raw of text.split('\n')) {
    const line = raw.trim()
    if (!line) continue
    if (line.startsWith('## ')) {
      if (current.heading || current.lines.length > 0) sections.push(current)
      current = { heading: line.replace(/^##\s*/, ''), lines: [] }
    } else {
      current.lines.push(line)
    }
  }
  if (current.heading || current.lines.length > 0) sections.push(current)
  return sections
}
