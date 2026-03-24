import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/animations/hooks/useReducedMotion'
import { useSessionStore } from '@/store/sessionStore'
import { runDeliberation } from '@/agents/facilitator'
import { PersonaPanel } from '@/components/PersonaPanel/PersonaPanel'
import { CardFace } from '@/components/Card/CardFace'
import type { PersonaId } from '@/types/session'
import styles from './DeliberationPage.module.css'

const DELIBERATION_ORDER: PersonaId[] = ['critic', 'optimist', 'academic', 'practitioner', 'philosopher']

export function DeliberationPage() {
  const prefersReduced = useReducedMotion()
  const navigate = useNavigate()
  const hasStarted = useRef(false)

  const {
    challengeInput,
    selectedAgenda,
    drawnCards,
    personaResponses,
    addPersonaResponse,
    updatePersonaResponse,
    finalizePersonaResponse,
    setPhase,
    setFacilitatorStreaming,
  } = useSessionStore()

  useEffect(() => {
    if (!challengeInput) { navigate('/'); return }
    if (hasStarted.current) return
    hasStarted.current = true

    setFacilitatorStreaming(true)

    DELIBERATION_ORDER.forEach((id) => {
      addPersonaResponse({ personaId: id, content: '', isStreaming: false })
    })

    runDeliberation(challengeInput, selectedAgenda, drawnCards, [], {
      onChunk: (personaId, chunk) => {
        const existing = useSessionStore.getState().personaResponses.find((r) => r.personaId === personaId)
        if (!existing) {
          useSessionStore.getState().addPersonaResponse({ personaId, content: chunk, isStreaming: true })
        } else if (!existing.isStreaming) {
          // Mark as streaming when first chunk arrives
          useSessionStore.setState((s) => ({
            personaResponses: s.personaResponses.map((r) =>
              r.personaId === personaId ? { ...r, isStreaming: true } : r
            ),
          }))
          updatePersonaResponse(personaId, chunk)
        } else {
          updatePersonaResponse(personaId, chunk)
        }
      },
      onComplete: (personaId) => {
        finalizePersonaResponse(personaId)
      },
      onError: (personaId, error) => {
        console.error(`Persona ${personaId} error:`, error)
        finalizePersonaResponse(personaId)
      },
    }).finally(() => setFacilitatorStreaming(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const allComplete = personaResponses.length === DELIBERATION_ORDER.length &&
    personaResponses.every((r) => !r.isStreaming && r.content.length > 0)

  const activePersonaId = personaResponses.find((r) => r.isStreaming)?.personaId ?? null

  function handleProceed() {
    setPhase('synthesis')
    navigate('/session/synthesis')
  }

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        {/* Sidebar: drawn cards */}
        <motion.aside
          className={styles.sidebar}
          initial={{ opacity: 0, x: prefersReduced ? 0 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="subheading" style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' }}>
            The Spread
          </span>
          <div className={styles.cardStack}>
            {Object.values(drawnCards).map((card) => (
              <CardFace key={card.id} card={card} compact />
            ))}
          </div>
        </motion.aside>

        {/* Main: persona responses */}
        <main className={styles.main}>
          <div className={styles.header}>
            <span className="subheading" style={{ color: 'var(--color-new-leaf)', fontSize: '0.7rem' }}>
              Phase 3 — Deliberation
            </span>
            <h1 className={styles.title}>The Deliberation</h1>
            <p className={styles.subtitle}>
              {challengeInput?.challenge}
            </p>
          </div>

          <div className={styles.responses}>
            {DELIBERATION_ORDER.map((personaId) => {
              const response = personaResponses.find((r) => r.personaId === personaId)
              if (!response) return null
              return (
                <PersonaPanel
                  key={personaId}
                  personaId={personaId}
                  content={response.content}
                  isStreaming={response.isStreaming}
                  isActive={activePersonaId === personaId}
                />
              )
            })}
          </div>

          {allComplete && (
            <motion.div
              className={styles.actions}
              initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <p className={styles.actionHint}>All five perspectives have been heard.</p>
              <div className={styles.buttonRow}>
                <motion.button
                  className={styles.secondaryButton}
                  onClick={() => navigate('/session/draw')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  ← Redraw
                </motion.button>
                <motion.button
                  className={styles.primaryButton}
                  onClick={handleProceed}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Synthesise →
                </motion.button>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  )
}
