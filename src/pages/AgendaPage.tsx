import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '@/animations/hooks/useReducedMotion'
import { useSessionStore } from '@/store/sessionStore'
import { agendaCards } from '@/data/cards/index'
import type { SelectedAgenda } from '@/types/session'
import styles from './AgendaPage.module.css'
import logoUrl from '@/assets/WEB/WEB/Landscape/ShiftFlow-Logo-Landscape-FullColour-DarkBackground-2500x930px-72dpi.png'

export function AgendaPage() {
  const prefersReduced = useReducedMotion()
  const navigate = useNavigate()
  const { challengeInput, setSelectedAgenda, setPhase } = useSessionStore()

  const [selected, setSelected] = useState<SelectedAgenda | null>(null)

  useEffect(() => {
    if (!challengeInput) navigate('/session/challenge')
  }, [challengeInput, navigate])

  function handleConfirm() {
    if (!selected) return
    setSelectedAgenda(selected)
    setPhase('draw')
    navigate('/session/draw')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: prefersReduced ? 0 : 0.05 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 12 },
    visible: { opacity: 1, y: 0, transition: { duration: prefersReduced ? 0 : 0.3 } },
  }

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <img
          src={logoUrl}
          alt="ShiftFlow"
          className={styles.logo}
        />
        <span className={`subheading ${styles.appLabel}`}>Cards Against Bureaucracy</span>
      </div>

      <div className={styles.container}>
        <div className={styles.header}>
          <span className="subheading" style={{ color: 'var(--color-ocean)', fontSize: '0.7rem' }}>
            Step 2 of 4 — Agenda
          </span>
          <h1 className={styles.title}>Select your change agenda</h1>
          <p className={styles.subtitle}>
            Choose the transformation type that best describes the nature of your challenge.
            This will frame how the cards are interpreted.
          </p>
        </div>

        <motion.div
          className={styles.grid}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {agendaCards.map((card) => {
            const isSelected = selected?.id === card.id
            return (
              <motion.button
                key={card.id}
                className={`${styles.card} ${isSelected ? styles.cardSelected : ''}`}
                variants={itemVariants}
                onClick={() =>
                  setSelected({
                    id: card.id,
                    title: card.title,
                    transformationType: card.transformationType,
                    statement: card.statement,
                    designProvocation: card.designProvocation,
                  })
                }
                whileHover={{ scale: prefersReduced ? 1 : 1.01 }}
                whileTap={{ scale: prefersReduced ? 1 : 0.99 }}
              >
                <div className={styles.cardMeta}>
                  <span className={styles.cardNumber}>{String(agendaCards.indexOf(card) + 1).padStart(2, '0')}</span>
                  {isSelected && <span className={styles.selectedBadge}>✓</span>}
                </div>
                <div className={styles.cardBody}>
                  <span className={styles.cardTitle}>{card.title}</span>
                  <p className={styles.cardType}>{card.transformationType}</p>
                </div>
                <div className={styles.cardProvocation}>
                  <p className={styles.cardProvocationText}>{card.designProvocation}</p>
                </div>
              </motion.button>
            )
          })}
        </motion.div>

        <AnimatePresence>
          {selected && (
            <motion.div
              className={styles.actions}
              initial={{ opacity: 0, y: prefersReduced ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className={styles.selectionSummary}>
                <span className={styles.selectionLabel}>Selected:</span>
                <span className={styles.selectionTitle}>{selected.title}</span>
              </div>
              <motion.button
                className={styles.confirmButton}
                onClick={handleConfirm}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Draw the Cards →
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
