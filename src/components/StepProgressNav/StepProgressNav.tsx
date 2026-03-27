import { useEffect, useRef } from 'react'
import { useSessionStore } from '@/store/sessionStore'
import { useAnimationStore } from '@/store/animationStore'
import { STEPS, getStepNumber } from '@/utils/stepProgress'
import styles from './StepProgressNav.module.css'

export function StepProgressNav() {
  const phase = useSessionStore((s) => s.phase)
  const { setPlaying, setProgress } = useAnimationStore()
  const currentStep = getStepNumber(phase)
  const hasAnimated = useRef(false)

  useEffect(() => {
    hasAnimated.current = false
    setProgress(0)
    setPlaying(true)

    // Short delay so CSS transition fires after mount
    const timeout = setTimeout(() => {
      hasAnimated.current = true
      setPlaying(false)
    }, 900)

    return () => clearTimeout(timeout)
  }, [phase])

  return (
    <nav className={styles.nav} aria-label="Session progress">
      {STEPS.map((step, i) => {
        const stepNum = i + 1
        const isDone = stepNum < currentStep
        const isActive = stepNum === currentStep
        const isLast = i === STEPS.length - 1

        return (
          <div key={step.phase} className={styles.nodeWrapper}>
            {/* Circle */}
            <div
              className={[
                styles.circle,
                isDone ? styles.done : '',
                isActive ? styles.active : '',
                !isDone && !isActive ? styles.future : '',
              ].join(' ')}
              aria-current={isActive ? 'step' : undefined}
            >
              {isDone ? (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path
                    d="M2 5l2.5 2.5L8 3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <span className={styles.stepNum}>{stepNum}</span>
              )}
            </div>

            {/* Label beside circle */}
            <span
              className={[
                styles.label,
                isDone ? styles.labelDone : '',
                isActive ? styles.labelActive : '',
                !isDone && !isActive ? styles.labelFuture : '',
              ].join(' ')}
            >
              {step.label}
            </span>

            {/* Connector line below circle (not on last step) */}
            {!isLast && (
              <div
                className={[
                  styles.connector,
                  isDone ? styles.connectorDone : styles.connectorFuture,
                ].join(' ')}
              />
            )}
          </div>
        )
      })}
    </nav>
  )
}
