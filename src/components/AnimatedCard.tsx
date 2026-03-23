import { m } from 'framer-motion'
import { buttonTap } from '@/animations/variants/microVariants'
import { useReducedMotion } from '@/animations/hooks/useReducedMotion'
import type { ReactNode } from 'react'

interface AnimatedCardProps {
  children: ReactNode
  onClick?: () => void
}

export function AnimatedCard({ children, onClick }: AnimatedCardProps) {
  const reduced = useReducedMotion()

  return (
    <m.div
      variants={reduced ? undefined : buttonTap}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      style={{ cursor: 'pointer', padding: '1rem', borderRadius: '8px', background: '#1a1a2e' }}
    >
      {children}
    </m.div>
  )
}
