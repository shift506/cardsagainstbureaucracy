import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '@/animations/hooks/useReducedMotion'
import { useSessionStore } from '@/store/sessionStore'
import { barrierCards, enablerCards, theoryCards, toolCards, provocationCards } from '@/data/cards/index'
import { SpreadBoard } from '@/components/Spread/SpreadBoard'
import { ActiveCardSlot } from '@/components/Spread/ActiveCardSlot'
import type { CardCategory, DrawnCard } from '@/types/session'
import styles from './DrawPage.module.css'

const DRAW_ORDER: CardCategory[] = ['barrier', 'enabler', 'theory', 'tool', 'provocation']

const CARD_POOLS: Record<CardCategory, DrawnCard[]> = {
  barrier:    barrierCards    as unknown as DrawnCard[],
  enabler:    enablerCards    as unknown as DrawnCard[],
  theory:     theoryCards     as unknown as DrawnCard[],
  tool:       toolCards       as unknown as DrawnCard[],
  provocation:provocationCards as unknown as DrawnCard[],
  agenda: [],
}

function pickUnseen(pool: DrawnCard[], seen: number[]): { item: DrawnCard; index: number; resetCycle: boolean } {
  const available = pool.map((_, i) => i).filter((i) => !seen.includes(i))
  const cycleReset = available.length === 0
  const candidates = cycleReset ? pool.map((_, i) => i) : available
  const index = candidates[Math.floor(Math.random() * candidates.length)]
  return { item: pool[index], index, resetCycle: cycleReset }
}

const INSTRUCTIONS: Record<string, string> = {
  reveal:  'Click the card to reveal your draw.',
  preview: 'Shuffle to see another card, or lock in your choice.',
  done:    'Your spread is complete. Ready to deliberate.',
}

export function DrawPage() {
  const prefersReduced = useReducedMotion()
  const navigate = useNavigate()
  const { challengeInput, drawnCards, drawCard, clearDrawnCards, setPhase } = useSessionStore()

  const [activeIndex, setActiveIndex] = useState(0)
  const [previewCard, setPreviewCard] = useState<DrawnCard | null>(null)
  const [isShuffling, setIsShuffling] = useState(false)
  const [seenIndices, setSeenIndices] = useState<number[]>([])

  useEffect(() => {
    if (!challengeInput) navigate('/')
  }, [challengeInput, navigate])

  useEffect(() => { setPhase('draw') }, [])

  const activeCategory = DRAW_ORDER[activeIndex] ?? null
  const allDrawn = activeIndex >= DRAW_ORDER.length

  // Reset preview and seen indices whenever the active suit changes
  useEffect(() => {
    setPreviewCard(null)
    setIsShuffling(false)
    setSeenIndices([])
  }, [activeIndex])

  function handleReveal() {
    if (!activeCategory) return
    const pool = CARD_POOLS[activeCategory]
    const { item, index, resetCycle } = pickUnseen(pool, seenIndices)
    setSeenIndices(resetCycle ? [index] : [...seenIndices, index])
    setPreviewCard({ ...item, imageIndex: index })
  }

  function handleShuffle() {
    if (!activeCategory || isShuffling) return
    setIsShuffling(true)
    const pool = CARD_POOLS[activeCategory]
    const { item, index, resetCycle } = pickUnseen(pool, seenIndices)
    const nextSeen = resetCycle ? [index] : [...seenIndices, index]
    // Brief pause so the exit animation plays before the new card enters
    setTimeout(() => {
      setSeenIndices(nextSeen)
      setPreviewCard({ ...item, imageIndex: index })
      setIsShuffling(false)
    }, prefersReduced ? 0 : 220)
  }

  function handleConfirm() {
    if (!previewCard || !activeCategory) return
    drawCard(activeCategory, previewCard)
    setActiveIndex((i) => i + 1)
  }

  function handleRedraw() {
    clearDrawnCards()
    setActiveIndex(0)
    setPreviewCard(null)
    setSeenIndices([])
  }

  function handleProceed() {
    setPhase('deliberation')
    navigate('/session/deliberation')
  }

  const instructionKey = allDrawn ? 'done' : previewCard ? 'preview' : 'reveal'

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <span className="subheading" style={{ color: 'var(--color-new-leaf)', fontSize: '0.7rem' }}>
          Step 3 of 5 — The Draw
        </span>
        <h1 className={styles.title}>Draw your cards</h1>
        <AnimatePresence mode="wait">
          <motion.p
            key={instructionKey}
            className={styles.instruction}
            initial={{ opacity: 0, y: prefersReduced ? 0 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: prefersReduced ? 0 : -6 }}
            transition={{ duration: 0.25 }}
            style={{ color: allDrawn ? 'var(--color-new-leaf)' : undefined }}
          >
            {INSTRUCTIONS[instructionKey]}
          </motion.p>
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        {!allDrawn && activeCategory && (
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: prefersReduced ? 0 : -16 }}
            transition={{ duration: 0.3 }}
          >
            <ActiveCardSlot
              category={activeCategory}
              previewCard={previewCard}
              isShuffling={isShuffling}
              onReveal={handleReveal}
              onShuffle={handleShuffle}
              onConfirm={handleConfirm}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress strip — drawn cards so far */}
      <SpreadBoard drawnCards={drawnCards} activeCategory={activeCategory} />

      <AnimatePresence>
        {allDrawn && (
          <motion.div
            className={styles.actions}
            initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              className={styles.redrawButton}
              onClick={handleRedraw}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ← Redraw Cards
            </motion.button>
            <motion.button
              className={styles.proceedButton}
              onClick={handleProceed}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Begin Deliberation →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
