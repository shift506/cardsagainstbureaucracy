import { domAnimation, LazyMotion } from 'framer-motion'
import type { ReactNode } from 'react'

export const springs = {
  default: { type: 'spring' as const, stiffness: 300, damping: 24 },
  bouncy: { type: 'spring' as const, stiffness: 400, damping: 10 },
  stiff: { type: 'spring' as const, stiffness: 600, damping: 30 },
  gentle: { type: 'spring' as const, stiffness: 120, damping: 20 },
}

export const easings = {
  smooth: [0.4, 0, 0.2, 1] as [number, number, number, number],
  snap: [0.6, -0.05, 0.01, 0.99] as [number, number, number, number],
  anticipate: [0.36, 0, 0.66, -0.56] as [number, number, number, number],
}

export function MotionProvider({ children }: { children: ReactNode }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>
}
