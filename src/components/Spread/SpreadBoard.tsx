import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '@/animations/hooks/useReducedMotion'
import type { CardCategory, DrawnCard } from '@/types/session'
import { CardFace } from '@/components/Card/CardFace'
import { CardBack } from '@/components/Card/CardBack'
import styles from './SpreadBoard.module.css'

const DRAW_ORDER: CardCategory[] = ['barrier', 'enabler', 'theory', 'tool', 'provocation']

const SLOT_LABELS: Record<CardCategory, string> = {
  barrier:    'Barrier',
  enabler:    'Enabler',
  theory:     'Theory',
  tool:       'Tool',
  provocation:'Provocation',
  agenda:     'Agenda',
}

interface SpreadBoardProps {
  drawnCards: Partial<Record<CardCategory, DrawnCard>>
  activeCategory: CardCategory | null
}

export function SpreadBoard({ drawnCards, activeCategory }: SpreadBoardProps) {
  const prefersReduced = useReducedMotion()

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: prefersReduced ? 0 : 0.08 } },
  }

  const slotVariants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 12 },
    visible: { opacity: 1, y: 0, transition: { duration: prefersReduced ? 0 : 0.35 } },
  }

  // Don't render until at least one card has been drawn or we're past the first slot
  const hasProgress = Object.keys(drawnCards).length > 0

  if (!hasProgress) return null

  return (
    <motion.div
      className={styles.board}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {DRAW_ORDER.map((category) => {
        const card = drawnCards[category]
        const isDrawn = !!card
        const isUpcoming = !isDrawn && category !== activeCategory

        if (isUpcoming) return null  // only show drawn + active slots

        return (
          <motion.div
            key={category}
            className={`${styles.slot} ${isDrawn ? styles.drawn : styles.pending}`}
            variants={slotVariants}
            layout
          >
            <span className={`${styles.slotLabel} subheading`}>{SLOT_LABELS[category]}</span>

            <AnimatePresence mode="wait">
              {isDrawn ? (
                <motion.div
                  key="face"
                  initial={{ opacity: 0, scale: prefersReduced ? 1 : 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: prefersReduced ? 0 : 0.4 }}
                >
                  <CardFace card={card} compact />
                </motion.div>
              ) : (
                <motion.div key="back" initial={{ opacity: 0.4 }} animate={{ opacity: 0.4 }}>
                  <CardBack category={category} />
                </motion.div>
              )}
            </AnimatePresence>

            {isDrawn && (
              <motion.span
                className={styles.lockedBadge}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.2 }}
              >
                ✓
              </motion.span>
            )}
          </motion.div>
        )
      })}
    </motion.div>
  )
}
