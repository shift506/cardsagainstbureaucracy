export interface FeatureFlags {
  enableParticleSystem: boolean
  enableWebGL: boolean
  enableAIAnimator: boolean
}

export interface FlagConfig {
  defaultValue: boolean
  rolloutPercent: number
}

export const flagDefinitions: Record<keyof FeatureFlags, FlagConfig> = {
  enableParticleSystem: { defaultValue: false, rolloutPercent: 0 },
  enableWebGL: { defaultValue: false, rolloutPercent: 0 },
  enableAIAnimator: { defaultValue: false, rolloutPercent: 0 },
}

export function getFlag(flag: keyof FeatureFlags, userId?: string): boolean {
  const def = flagDefinitions[flag]
  if (def.rolloutPercent === 0) return def.defaultValue
  if (def.rolloutPercent === 100) return true
  if (!userId) return def.defaultValue
  // Simple hash-based rollout
  let hash = 0
  for (const ch of userId) hash = (hash * 31 + ch.charCodeAt(0)) % 100
  return hash < def.rolloutPercent
}
