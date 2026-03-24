import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/animations/hooks/useReducedMotion'
import { useSessionStore } from '@/store/sessionStore'
import { captureLead } from '@/lib/supabase'
import type { ChallengeInput } from '@/types/session'
import styles from './ChallengePage.module.css'
import logoUrl from '@/assets/WEB/WEB/Landscape/ShiftFlow-Logo-Landscape-FullColour-DarkBackground-2500x930px-72dpi.png'

export function ChallengePage() {
  const prefersReduced = useReducedMotion()
  const navigate = useNavigate()
  const { setChallengeInput, setPhase } = useSessionStore()

  const [form, setForm] = useState<ChallengeInput>({
    name: '',
    context: '',
    stakeholders: '',
    stakes: '',
    transformFrom: '',
    transformTo: '',
    transformSoThat: '',
  })
  const [email, setEmail] = useState('')
  const [userName, setUserName] = useState('')
  const [organisation, setOrganisation] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function set(key: keyof ChallengeInput) {
    return (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  const isValid =
    email.trim().includes('@') &&
    userName.trim().length > 0 &&
    organisation.trim().length > 0 &&
    form.name.trim().length > 0 &&
    form.context.trim().length > 0 &&
    form.transformFrom.trim().length > 0 &&
    form.transformTo.trim().length > 0 &&
    form.transformSoThat.trim().length > 0

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!isValid || isSubmitting) return

    setIsSubmitting(true)
    try {
      await captureLead({
        email: email.trim(),
        name: userName.trim(),
        organisation: organisation.trim(),
        challenge: form.name.trim(),
        context: form.context.trim(),
        stakeholders: form.stakeholders.trim(),
        stakes: form.stakes.trim(),
        transform_from: form.transformFrom.trim(),
        transform_to: form.transformTo.trim(),
        transform_so_that: form.transformSoThat.trim(),
      })
    } catch {
      // Non-blocking — proceed even if lead capture fails
    }
    setChallengeInput(form)
    setPhase('agenda')
    navigate('/session/agenda')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: prefersReduced ? 0 : 0.08 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 16 },
    visible: { opacity: 1, y: 0, transition: { duration: prefersReduced ? 0 : 0.4 } },
  }

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <img
          src={logoUrl}
          alt="ShiftFlow"
          className={styles.logo}
        />
        <span className={`subheading ${styles.appLabel}`}>Cards Against Bureaucracy</span>
      </div>

      <motion.div
        className={styles.container}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className={styles.header} variants={itemVariants}>
          <span className="subheading" style={{ color: 'var(--color-ocean)', fontSize: '0.7rem' }}>
            Step 1 of 4 — Setup
          </span>
          <h1 className={styles.title}>Frame your challenge</h1>
          <p className={styles.subtitle}>
            Be specific. The quality of the deliberation depends on the quality of the framing.
          </p>
        </motion.div>

        <motion.form className={styles.form} onSubmit={handleSubmit} variants={itemVariants}>
          {/* Email */}
          <div className={styles.field}>
            <label className={styles.label}>
              <span className={styles.labelText}>Your Email</span>
              <span className={styles.labelHint}>We'll send you a copy of your session summary</span>
            </label>
            <input
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@organisation.com"
              required
            />
          </div>

          {/* Name */}
          <div className={styles.field}>
            <label className={styles.label}>
              <span className={styles.labelText}>Your Name</span>
            </label>
            <input
              type="text"
              className={styles.input}
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Jane Smith"
              required
            />
          </div>

          {/* Organisation */}
          <div className={styles.field}>
            <label className={styles.label}>
              <span className={styles.labelText}>Organisation</span>
            </label>
            <input
              type="text"
              className={styles.input}
              value={organisation}
              onChange={(e) => setOrganisation(e.target.value)}
              placeholder="Department of..."
              required
            />
          </div>

          {/* Challenge name */}
          <div className={styles.field}>
            <label className={styles.label}>
              <span className={styles.labelText}>Challenge name</span>
              <span className={styles.labelHint}>A short title for what you are working on.</span>
            </label>
            <input
              type="text"
              className={styles.input}
              value={form.name}
              onChange={set('name')}
              placeholder="e.g. Accelerating digital service delivery across departments"
              required
            />
          </div>

          {/* Context */}
          <div className={styles.field}>
            <label className={styles.label}>
              <span className={styles.labelText}>Context</span>
              <span className={styles.labelHint}>Describe the organisational situation. What has been tried? What is the history?</span>
            </label>
            <textarea
              className={styles.textarea}
              value={form.context}
              onChange={set('context')}
              placeholder="Our department has attempted three digital transformation programmes in the last five years..."
              rows={4}
              required
            />
          </div>

          {/* Stakeholders */}
          <div className={styles.field}>
            <label className={styles.label}>
              <span className={styles.labelText}>Stakeholders</span>
              <span className={styles.labelHint}>Who is affected by this challenge and how?</span>
            </label>
            <textarea
              className={styles.textarea}
              value={form.stakeholders}
              onChange={set('stakeholders')}
              placeholder="Frontline staff who manage paper-based processes, senior leadership who have mandated the change..."
              rows={3}
            />
          </div>

          {/* Stakes */}
          <div className={styles.field}>
            <label className={styles.label}>
              <span className={styles.labelText}>Stakes</span>
              <span className={styles.labelHint}>What happens if this is resolved well? What happens if it is not?</span>
            </label>
            <textarea
              className={styles.textarea}
              value={form.stakes}
              onChange={set('stakes')}
              placeholder="If resolved well: faster service delivery, reduced costs, improved staff morale..."
              rows={3}
            />
          </div>

          {/* Transformation statement */}
          <div className={styles.transformSection}>
            <p className={styles.transformHeading}>Transformation statement</p>
            <p className={styles.transformSubheading}>Name what you are trying to change and why it matters.</p>

            <div className={styles.field}>
              <label className={styles.label}>
                <span className={styles.labelText}>We are transforming <em>from…</em></span>
                <span className={styles.labelHint}>The current state — what is broken, stuck, or insufficient.</span>
              </label>
              <textarea
                className={styles.textarea}
                value={form.transformFrom}
                onChange={set('transformFrom')}
                placeholder="e.g. siloed decision-making driven by hierarchy"
                rows={2}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                <span className={styles.labelText}><em>…to…</em></span>
                <span className={styles.labelHint}>The desired future state — what you want to be true instead.</span>
              </label>
              <textarea
                className={styles.textarea}
                value={form.transformTo}
                onChange={set('transformTo')}
                placeholder="e.g. distributed leadership with clear accountability"
                rows={2}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                <span className={styles.labelText}><em>…so that…</em></span>
                <span className={styles.labelHint}>The outcome — why this matters and who benefits.</span>
              </label>
              <textarea
                className={styles.textarea}
                value={form.transformSoThat}
                onChange={set('transformSoThat')}
                placeholder="e.g. frontline teams can respond faster without waiting for approval"
                rows={2}
                required
              />
            </div>
          </div>

          <div className={styles.actions}>
            <motion.button
              type="submit"
              className={styles.submitButton}
              disabled={!isValid || isSubmitting}
              whileHover={isValid && !isSubmitting ? { scale: 1.02 } : {}}
              whileTap={isValid && !isSubmitting ? { scale: 0.98 } : {}}
            >
              {isSubmitting ? 'Starting…' : 'Continue to Agenda →'}
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  )
}
