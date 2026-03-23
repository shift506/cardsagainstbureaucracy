import { m, AnimatePresence } from 'framer-motion'
import { pageVariants } from '@/animations/variants/pageVariants'
import { scrollReveal } from '@/animations/variants/scrollVariants'
import { useScrollReveal } from '@/animations/hooks/useScrollReveal'
import { AnimatedCard } from '@/components/AnimatedCard'

export function HomePage() {
  const { ref, isInView } = useScrollReveal()

  return (
    <AnimatePresence mode="wait">
      <m.main
        key="home"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ minHeight: '100vh', padding: '2rem' }}
      >
        <h1>Animation Studio</h1>
        <m.section
          ref={ref as React.RefObject<HTMLElement>}
          variants={scrollReveal}
          initial="offscreen"
          animate={isInView ? 'onscreen' : 'offscreen'}
        >
          <AnimatedCard>
            <p>Scroll-triggered card animation</p>
          </AnimatedCard>
        </m.section>
      </m.main>
    </AnimatePresence>
  )
}
