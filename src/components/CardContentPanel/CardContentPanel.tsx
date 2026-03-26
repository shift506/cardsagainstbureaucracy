import { motion } from 'framer-motion'
import { useReducedMotion } from '@/animations/hooks/useReducedMotion'
import { getPersona } from '@/agents/personas'
import {
  isBarrier, isEnabler, isTheory, isTool, isProvocation,
} from '@/data/types/cards'
import type { TransformationCard } from '@/data/types/cards'
import type { PersonaId } from '@/types/session'
import styles from './CardContentPanel.module.css'

interface CardContentPanelProps {
  personaId: PersonaId
  card: TransformationCard
  index: number
  isOpen?: boolean
  onToggle?: () => void
}

export function CardContentPanel({ personaId, card, index, isOpen = true, onToggle }: CardContentPanelProps) {
  const prefersReduced = useReducedMotion()
  const persona = getPersona(personaId)

  return (
    <motion.div
      className={styles.panel}
      style={{ borderLeftColor: persona.color }}
      data-open={isOpen}
      initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: prefersReduced ? 0 : 0.4, delay: prefersReduced ? 0 : index * 0.1 }}
    >
      <div className={styles.header} onClick={onToggle}>
        <span className={styles.personaName} style={{ color: persona.color }}>
          {persona.name}
        </span>
        <div className={styles.headerRow}>
          <span className={styles.cardTitle}>{card.title}</span>
          <span className={styles.toggleIcon}>{isOpen ? '−' : '+'}</span>
        </div>
      </div>

      <div className={styles.body}>
        {isProvocation(card) ? (
          <>
            <blockquote className={styles.quote}>
              <p className={styles.quoteText}>"{card.quote}"</p>
              <cite className={styles.attribution}>— {card.attribution}</cite>
            </blockquote>
            <p className={styles.coreQuestion}>{card.coreQuestion}</p>
            <Section label="How to use it" items={card.howToUseIt} color={persona.color} />
            <Section label="Reflection" items={card.reflectionPrompts} color={persona.color} italic />
          </>
        ) : (
          <>
            {'description' in card && (
              <p className={styles.description}>{card.description}</p>
            )}
            {'whyItMatters' in card && (
              <div className={styles.section}>
                <span className={styles.sectionLabel} style={{ color: persona.color }}>Why it matters</span>
                <p className={styles.sectionText}>{card.whyItMatters as string}</p>
              </div>
            )}
            {isBarrier(card) && (
              <>
                <Section label="How it shows up" items={card.howItShowsUp} color={persona.color} />
                <Section label="How to counteract" items={card.howToCounteract} color={persona.color} />
                <ReflectionPrompt text={card.reflectionPrompt} />
              </>
            )}
            {isEnabler(card) && (
              <>
                <Section label="How to use it" items={card.howToUseIt} color={persona.color} />
                <ReflectionPrompt text={card.reflectionPrompt} />
              </>
            )}
            {(isTheory(card) || isTool(card)) && (
              <>
                {'howItShowsUp' in card && card.howItShowsUp && (
                  <Section label="How it shows up" items={card.howItShowsUp as string[]} color={persona.color} />
                )}
                <Section label="How to use it" items={card.howToUseIt} color={persona.color} />
                <Section label="Reflection" items={card.reflectionPrompts} color={persona.color} italic />
              </>
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}

function Section({ label, items, color, italic }: { label: string; items: string[]; color: string; italic?: boolean }) {
  if (!items?.length) return null
  return (
    <div className={styles.section}>
      <span className={styles.sectionLabel} style={{ color }}>{label}</span>
      <ul className={styles.list}>
        {items.map((item, i) => (
          <li key={i} className={`${styles.listItem} ${italic ? styles.italic : ''}`}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

function ReflectionPrompt({ text }: { text: string }) {
  if (!text) return null
  return (
    <p className={styles.reflection}>
      <span className={styles.reflectionMark}>?</span>
      {text}
    </p>
  )
}
