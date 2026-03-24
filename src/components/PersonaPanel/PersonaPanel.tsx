import { motion } from 'framer-motion'
import { useReducedMotion } from '@/animations/hooks/useReducedMotion'
import type { PersonaId } from '@/types/session'
import { getPersona } from '@/agents/personas'
import { renderInline } from '@/utils/renderMarkdown'
import styles from './PersonaPanel.module.css'

interface PersonaPanelProps {
  personaId: PersonaId
  content: string
  isStreaming: boolean
  isActive: boolean
}

export function PersonaPanel({ personaId, content, isStreaming, isActive }: PersonaPanelProps) {
  const prefersReduced = useReducedMotion()
  const persona = getPersona(personaId)

  const paragraphs = content
    .split('\n\n')
    .map((p) => p.trim())
    .filter(Boolean)

  return (
    <motion.div
      className={`${styles.panel} ${isActive ? styles.active : ''}`}
      style={{ borderLeftColor: persona.color }}
      initial={{ opacity: 0, x: prefersReduced ? 0 : -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: prefersReduced ? 0 : 0.4 }}
    >
      <div className={styles.header}>
        <span className={styles.name} style={{ color: persona.color }}>
          {persona.name}
        </span>
        {isStreaming && <span className={styles.streamingDot} />}
      </div>
      <div className={styles.content}>
        {paragraphs.length > 0 ? (
          paragraphs.map((para, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: renderInline(para) }} />
          ))
        ) : (
          !isStreaming && <span className={styles.placeholder}>Waiting…</span>
        )}
        {isStreaming && <span className={styles.cursor}>▋</span>}
      </div>
    </motion.div>
  )
}
