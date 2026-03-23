export const production = {
  apiEndpoint: 'https://api.my-animation-app.com',
  datadogEnv: 'production',
  sentryDsn: process.env.SENTRY_DSN_PROD ?? '',
  featureFlags: {
    enableParticleSystem: false,
    enableWebGL: false,
    enableAIAnimator: false,
  },
}
