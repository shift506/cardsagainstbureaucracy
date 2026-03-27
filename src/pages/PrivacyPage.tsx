export function PrivacyPage() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-galaxy)',
      color: 'var(--color-white)',
      padding: '64px 24px',
      display: 'flex',
      justifyContent: 'center',
    }}>
      <div style={{ maxWidth: 640, width: '100%' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: 8 }}>
          Privacy policy
        </h1>
        <p style={{ fontSize: '0.85rem', opacity: 0.45, marginBottom: 48 }}>
          Last updated: 27/03/2026
        </p>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12, color: 'var(--color-breeze)' }}>
            What we collect
          </h2>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.7, opacity: 0.8 }}>
            When you use Cards Against Bureaucracy, we collect your email address and the session
            inputs you provide (challenge name, context, and problem statement).
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12, color: 'var(--color-breeze)' }}>
            How your session data is processed
          </h2>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.7, opacity: 0.8 }}>
            Your session inputs are sent to the Claude API (Anthropic) to generate your synthesis.
            Anthropic's data handling is governed by their privacy policy at{' '}
            <a
              href="https://www.anthropic.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--color-breeze)', textDecoration: 'underline', textUnderlineOffset: 3 }}
            >
              anthropic.com/privacy
            </a>
            . Session inputs are stored for up to 30 days for operational purposes, then
            automatically deleted, and are never used to train AI models.
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12, color: 'var(--color-breeze)' }}>
            AI disclosure
          </h2>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.7, opacity: 0.8 }}>
            The synthesis generated at the end of your session is produced by Claude
            (claude-sonnet-4-6), a large language model made by Anthropic. The interpretation
            of that synthesis, and any decisions made from it, are entirely yours.
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12, color: 'var(--color-breeze)' }}>
            Contact
          </h2>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.7, opacity: 0.8 }}>
            For privacy questions or data deletion requests, contact:{' '}
            <a
              href="mailto:privacy@shiftflow.ca"
              style={{ color: 'var(--color-breeze)', textDecoration: 'underline', textUnderlineOffset: 3 }}
            >
              privacy@shiftflow.ca
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}
