import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '@/animations/hooks/useReducedMotion'
import type { CardCategory, DrawnCard } from '@/types/session'
import { CardBack } from '@/components/Card/CardBack'
import { CardFace } from '@/components/Card/CardFace'
import styles from './ActiveCardSlot.module.css'

const SUIT_LABELS: Record<CardCategory, string> = {
  barrier:    'Barriers',
  enabler:    'Enablers',
  theory:     'Theories',
  tool:       'Tools',
  provocation:'Provocations',
  agenda:     'Agenda',
}

interface ActiveCardSlotProps {
  category: CardCategory
  previewCard: DrawnCard | null
  isShuffling: boolean
  onReveal: () => void
  onShuffle: () => void
  onConfirm: () => void
}

export function ActiveCardSlot({
  category,
  previewCard,
  isShuffling,
  onReveal,
  onShuffle,
  onConfirm,
}: ActiveCardSlotProps) {
  const prefersReduced = useReducedMotion()

  const cardVariants = {
    enter: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: { duration: prefersReduced ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
    },
    exit: {
      opacity: 0,
      scale: prefersReduced ? 1 : 0.92,
      transition: { duration: prefersReduced ? 0 : 0.18 },
    },
    initial: {
      opacity: 0,
      scale: prefersReduced ? 1 : 0.94,
    },
  }

  return (
    <div className={styles.slot}>
      <span className={`${styles.suitLabel} subheading`}>{SUIT_LABELS[category]}</span>

      <div className={styles.cardZone}>
        <AnimatePresence mode="wait">
          {!previewCard ? (
            /* Card back — click to reveal */
            <motion.div
              key="back"
              variants={cardVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              className={styles.cardWrap}
            >
              <CardBack category={category} onClick={onReveal} />
              <motion.p
                className={styles.clickHint}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Click to reveal
              </motion.p>
            </motion.div>
          ) : (
            /* Card face — click to shuffle */
            <motion.div
              key={previewCard.id}
              variants={cardVariants}
              initial="initial"
              animate={isShuffling ? 'exit' : 'enter'}
              exit="exit"
              className={styles.cardWrap}
              onClick={onShuffle}
              style={{ cursor: 'pointer' }}
              title="Click to see a different card"
            >
              <CardFace card={previewCard} />
              <motion.p
                className={styles.clickHint}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Click card to shuffle
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action buttons — only shown when a card is previewed */}
      <AnimatePresence>
        {previewCard && !isShuffling && (
          <motion.div
            className={styles.actions}
            initial={{ opacity: 0, y: prefersReduced ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.button
              className={styles.confirmButton}
              onClick={onConfirm}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              Draw This Card →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
