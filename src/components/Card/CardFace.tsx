import { motion } from 'framer-motion'
import type { DrawnCard } from '@/types/session'
import { getCardFaceImage } from '@/utils/cardImages'
import styles from './Card.module.css'

interface CardFaceProps {
  card: DrawnCard
  compact?: boolean
  onClick?: () => void
}

export function CardFace({ card, compact = false, onClick }: CardFaceProps) {
  const faceImage = getCardFaceImage(card.category, card.imageIndex)

  return (
    <motion.div
      className={`${styles.card} ${styles.cardFace} ${compact ? styles.compact : ''}`}
      onClick={onClick}
      whileHover={onClick ? { y: -6, boxShadow: 'var(--shadow-card-hover)' } : {}}
    >
      {faceImage ? (
        <img
          src={faceImage}
          alt={card.title}
          className={styles.cardImage}
          draggable={false}
        />
      ) : (
        /* Text fallback if image not found */
        <>
          <div className={styles.cardAccent} style={{ backgroundColor: card.color }} />
          <div className={styles.cardContent}>
            <span className={`${styles.categoryLabel} subheading`} style={{ color: card.color }}>
              {card.category}
            </span>
            <h3 className={styles.cardTitle}>{card.title}</h3>
            {!compact && <p className={styles.cardDescription}>{card.description}</p>}
          </div>
        </>
      )}
    </motion.div>
  )
}
