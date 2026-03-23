import { create } from 'zustand'

interface AnimationState {
  currentScene: string
  isPlaying: boolean
  progress: number
  setScene: (scene: string) => void
  setPlaying: (playing: boolean) => void
  setProgress: (progress: number) => void
}

export const useAnimationStore = create<AnimationState>((set) => ({
  currentScene: 'default',
  isPlaying: false,
  progress: 0,
  setScene: (scene) => set({ currentScene: scene }),
  setPlaying: (playing) => set({ isPlaying: playing }),
  setProgress: (progress) => set({ progress }),
}))
