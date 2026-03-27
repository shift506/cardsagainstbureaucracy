import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/animations/hooks/useReducedMotion'
import { useSessionStore } from '@/store/sessionStore'
import styles from './LandingPage.module.css'
import logoUrl from '@/assets/WEB/WEB/Landscape/ShiftFlow-Logo-Landscape-FullColour-DarkBackground-2500x930px-72dpi.png'

export function LandingPage() {
  const prefersReduced = useReducedMotion()
  const navigate = useNavigate()
  const { reset, setEmail } = useSessionStore()
  const [emailInput, setEmailInput] = useState('')

  const isValidEmail = emailInput.trim().includes('@') && emailInput.trim().includes('.')

  function handleStart() {
    reset()
    setEmail(emailInput.trim())
    navigate('/session/challenge')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: prefersReduced ? 0 : 0.12 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 24 },
    visible: { opacity: 1, y: 0, transition: { duration: prefersReduced ? 0 : 0.5 } },
  }

  const SUITS = [
    { label: 'Barriers', color: 'var(--color-barriers)' },
    { label: 'Enablers', color: 'var(--color-enablers)' },
    { label: 'Theories', color: 'var(--color-theories)' },
    { label: 'Tools', color: 'var(--color-tools)' },
    { label: 'Provocations', color: 'var(--color-provocations)' },
  ]

  return (
    <div className={styles.page}>
      <div className={styles.banner}>
        <span className={styles.bannerEmoji}>🃏</span>
        <p className={styles.bannerText}>
          <strong>This is a taste of what's possible.</strong>{' '}
          The real breakthroughs happen in the room, with your team and the physical deck. Try the digital version first —{' '}
          <a href="https://www.shiftflow.ca/transformation" target="_blank" rel="noopener noreferrer" className={styles.bannerLink}>
            Book an in-person session →
          </a>
        </p>
      </div>
      <div className={styles.content}>
      <motion.div
        className={styles.container}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className={styles.eyebrow} variants={itemVariants}>
          <a href="https://www.shiftflow.ca/transformation" target="_blank" rel="noopener noreferrer">
            <img src={logoUrl} alt="ShiftFlow" className={styles.logo} />
          </a>
        </motion.div>

        <motion.h1 className={styles.title} variants={itemVariants}>
          Cards Against Bureaucracy
        </motion.h1>

        <motion.p className={styles.tagline} variants={itemVariants} style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', color: 'var(--color-white)', lineHeight: 1.2, marginBottom: 0 }}>
          You've had the meeting.
        </motion.p>

        <motion.p className={styles.tagline} variants={itemVariants} style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', color: 'var(--color-new-leaf)', lineHeight: 1.2 }}>
          Now try the game.
        </motion.p>

        <motion.p className={styles.tagline} variants={itemVariants} style={{ opacity: 0.6, marginTop: 8 }}>
          A structured play session designed for that moment before the breakthrough.
        </motion.p>

        <div className={styles.personaChips}>
          <span className={styles.personaChip}>For managers trying to get unstuck</span>
          <span className={styles.personaChip}>For leaders pursuing a mandate</span>
          <span className={styles.personaChip}>For facilitators guiding a team</span>
        </div>

        <motion.div className={styles.suits} variants={itemVariants}>
          {SUITS.map((s) => (
            <span key={s.label} className={styles.suitPill} style={{ borderColor: s.color, color: s.color }}>
              {s.label}
            </span>
          ))}
        </motion.div>

        <motion.div className={styles.sessionSteps} variants={itemVariants}>
          {['Frame the challenge', 'Draw the cards', 'Hear all perspectives', 'Synthesise into action'].map((step, i) => (
            <div key={step} className={styles.step}>
              <span className={styles.stepNumber}>{i + 1}</span>
              <span className={styles.stepLabel}>{step}</span>
            </div>
          ))}
        </motion.div>

        <div className={styles.testimonials}>
          {[
            {
              quote: "The Transformation Deck turned abstract ideas into concrete insights we could immediately apply to our work.",
              attribution: "Senior Director, Singapore",
            },
          ].map((item, i) => (
            <div key={i} className={styles.testimonialItem}>
              <p className={styles.testimonialQuote}>"{item.quote}"</p>
              <p className={styles.testimonialAttribution}>— {item.attribution}</p>
            </div>
          ))}
        </div>

        <motion.div className={styles.emailGate} variants={itemVariants}>
          <input
            type="email"
            className={styles.emailInput}
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && isValidEmail && handleStart()}
            placeholder="Enter your email to start"
          />
          <p className={styles.emailHint}>
            We'll send you your session summary and occasionally share new resources.
          </p>
          <p className={styles.emailHint} style={{ marginTop: 0 }}>
            Your session data is processed by <strong>Claude (Anthropic)</strong> to generate your synthesis on Step 4.
          </p>
          <motion.button
            className={styles.startButton}
            onClick={handleStart}
            disabled={!isValidEmail}
            whileHover={isValidEmail ? { scale: 1.03 } : {}}
            whileTap={isValidEmail ? { scale: 0.97 } : {}}
          >
            Try it →
          </motion.button>
        </motion.div>
      </motion.div>
      </div>
    </div>
  )
}
