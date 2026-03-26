import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/animations/hooks/useReducedMotion'
import { useSessionStore } from '@/store/sessionStore'
import { getPersona } from '@/agents/personas'
import { CardContentPanel } from '@/components/CardContentPanel/CardContentPanel'
import { CardFace } from '@/components/Card/CardFace'
import { getCardById } from '@/data/cards/index'
import type { PersonaId } from '@/types/session'
import type { TransformationCard } from '@/data/types/cards'
import styles from './DeliberationPage.module.css'

const DELIBERATION_ORDER: PersonaId[] = ['critic', 'optimist', 'academic', 'practitioner', 'philosopher']

export function DeliberationPage() {
  const prefersReduced = useReducedMotion()
  const navigate = useNavigate()

  const { challengeInput, drawnCards, setPhase } = useSessionStore()
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  useEffect(() => {
    if (!challengeInput) navigate('/')
  }, [challengeInput, navigate])

  function handleProceed() {
    setPhase('synthesis')
    navigate('/session/synthesis')
  }

  const panels = DELIBERATION_ORDER.map((personaId) => {
    const persona = getPersona(personaId)
    const drawnCard = drawnCards[persona.suit]
    if (!drawnCard) return null
    const card = getCardById(drawnCard.id) as TransformationCard | undefined
    if (!card) return null
    return { personaId, card, drawnCard }
  }).filter(Boolean) as { personaId: PersonaId; card: TransformationCard; drawnCard: NonNullable<typeof drawnCards[keyof typeof drawnCards]> }[]

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
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

        <main className={styles.main}>
          <div className={styles.header}>
            <span className="subheading" style={{ color: 'var(--color-new-leaf)', fontSize: '0.7rem' }}>
              Phase 3 — Deliberation
            </span>
            <h1 className={styles.title}>The Spread</h1>
            {challengeInput && (
              <p className={styles.subtitle}>{challengeInput.name}</p>
            )}
          </div>

          <div className={styles.responses}>
            {panels.map(({ personaId, card }, i) => (
              <CardContentPanel
                key={personaId}
                personaId={personaId}
                card={card}
                index={i}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>

          {panels.length > 0 && (
            <motion.div
              className={styles.actions}
              initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: prefersReduced ? 0 : 0.6 }}
            >
              <p className={styles.actionHint}>Review the spread, then proceed to synthesis.</p>
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
