import { motion } from 'framer-motion'
import type { CardCategory } from '@/types/session'
import { getCardBackImage } from '@/utils/cardImages'
import styles from './Card.module.css'

interface CardBackProps {
  category: CardCategory
  onClick?: () => void
}

export function CardBack({ category, onClick }: CardBackProps) {
  const backImage = getCardBackImage(category)

  return (
    <motion.div
      className={`${styles.card} ${styles.cardBack}`}
      onClick={onClick}
      whileHover={onClick ? { y: -6, boxShadow: 'var(--shadow-card-hover)' } : {}}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {backImage ? (
        <img
          src={backImage}
          alt={`${category} card back`}
          className={styles.cardImage}
          draggable={false}
        />
      ) : (
        <div className={`${styles.backFallback} ${styles[category]}`} />
      )}
    </motion.div>
  )
}
