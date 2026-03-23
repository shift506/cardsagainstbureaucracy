import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useReducedMotion } from './useReducedMotion'

export function useScrollReveal(threshold = 0.2) {
  useReducedMotion() // must be first animation hook call
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, amount: threshold })
  return { ref, isInView }
}
