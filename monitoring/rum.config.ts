import type { RumInitConfiguration } from '@datadog/browser-rum'

export const rumConfig: RumInitConfiguration = {
  applicationId: process.env.VITE_DATADOG_APP_ID ?? '',
  clientToken: process.env.VITE_DATADOG_CLIENT_TOKEN ?? '',
  site: 'datadoghq.com',
  service: 'my-animation-app',
  env: process.env.VITE_ENV ?? 'development',
  version: process.env.VITE_APP_VERSION ?? '0.0.0',
  sessionSampleRate: 100,
  sessionReplaySampleRate: 20,
  trackUserInteractions: true,
  trackResources: true,
  trackLongTasks: true,
  defaultPrivacyLevel: 'mask-user-input',
}

export const rumActions = {
  animationStart: (name: string, duration: number) => {
    if (typeof window !== 'undefined' && (window as Record<string, unknown>).DD_RUM) {
      ((window as Record<string, unknown>).DD_RUM as { addAction: (name: string, ctx: Record<string, unknown>) => void })
        .addAction('animation_start', { name, duration })
    }
  },
  animationDrop: (name: string, fps: number) => {
    if (typeof window !== 'undefined' && (window as Record<string, unknown>).DD_RUM) {
      ((window as Record<string, unknown>).DD_RUM as { addAction: (name: string, ctx: Record<string, unknown>) => void })
        .addAction('animation_drop', { name, fps })
    }
  },
  reducedMotionActive: (active: boolean) => {
    if (typeof window !== 'undefined' && (window as Record<string, unknown>).DD_RUM) {
      ((window as Record<string, unknown>).DD_RUM as { addAction: (name: string, ctx: Record<string, unknown>) => void })
        .addAction('reduced_motion_active', { active })
    }
  },
}
