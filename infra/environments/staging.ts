export const staging = {
  apiEndpoint: 'https://api-staging.my-animation-app.com',
  datadogEnv: 'staging',
  sentryDsn: process.env.SENTRY_DSN_STAGING ?? '',
  featureFlags: {
    enableParticleSystem: true,
    enableWebGL: true,
    enableAIAnimator: true,
  },
}
