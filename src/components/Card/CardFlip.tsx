import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '@/animations/hooks/useReducedMotion'
import type { DrawnCard, CardCategory } from '@/types/session'
import { CardFace } from './CardFace'
import { CardBack } from './CardBack'
import styles from './Card.module.css'

interface CardFlipProps {
  card: DrawnCard
  category: CardCategory
  initiallyFlipped?: boolean
}

export function CardFlip({ card, category, initiallyFlipped = false }: CardFlipProps) {
  const prefersReduced = useReducedMotion()
  const [isFlipped, setIsFlipped] = useState(initiallyFlipped)

  const flipVariants = {
    front: { rotateY: 0, transition: { duration: prefersReduced ? 0 : 0.5 } },
    back: { rotateY: 180, transition: { duration: prefersReduced ? 0 : 0.5 } },
  }

  return (
    <div className={styles.flipContainer} onClick={() => setIsFlipped((f) => !f)}>
      <motion.div
        className={styles.flipInner}
        animate={isFlipped ? 'front' : 'back'}
        variants={flipVariants}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className={styles.flipFront}>
          <CardFace card={card} />
        </div>
        <div className={styles.flipBack}>
          <CardBack category={category} />
        </div>
      </motion.div>
      {!isFlipped && (
        <AnimatePresence>
          <motion.span
            className={styles.flipHint}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            Click to reveal
          </motion.span>
        </AnimatePresence>
      )}
    </div>
  )
}
