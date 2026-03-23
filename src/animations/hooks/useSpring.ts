import { useSpring as useFramerSpring, useMotionValue } from 'framer-motion'
import { useReducedMotion } from './useReducedMotion'
import { springs } from '../motion.config'

export function useSpring(initial = 0, preset: keyof typeof springs = 'default') {
  useReducedMotion()
  const motionVal = useMotionValue(initial)
  const springConfig = springs[preset]
  const spring = useFramerSpring(motionVal, springConfig)
  return { spring, set: motionVal.set.bind(motionVal) }
}
